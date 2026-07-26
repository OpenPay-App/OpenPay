package org.killbill.billing.plugin.hyperswitch;

import java.util.List;
import java.util.UUID;

import javax.annotation.Nullable;

import org.killbill.billing.payment.api.Payment;
import org.killbill.billing.payment.api.PluginProperty;
import org.killbill.billing.payment.api.TransactionType;
import org.killbill.billing.payment.plugin.api.PaymentMethodInfoPlugin;
import org.killbill.billing.payment.plugin.api.PaymentPluginApi;
import org.killbill.billing.payment.plugin.api.PaymentPluginApiException;
import org.killbill.billing.payment.plugin.api.PaymentPluginInfoPaymentMethods;
import org.killbill.billing.payment.plugin.api.PaymentPluginInfoProcessor;
import org.killbill.billing.plugin.api.PaymentPluginPlugin;
import org.killbill.billing.util.callcontext.CallContext;
import org.killbill.billing.util.callcontext.TenantContext;
import org.killbill.billing.util.tag.ControlTagType;
import org.osgi.framework.BundleContext;

import com.google.common.collect.ImmutableList;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

/**
 * Kill Bill Hyperswitch Payment Plugin
 * Handles synchronous payment processing through Hyperswitch with Paystack
 */
public class HyperswitchPaymentPlugin extends PaymentPluginPlugin implements PaymentPluginApi {

    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    private static final String PLUGIN_NAME = "killbill-hyperswitch";

    private final OkHttpClient httpClient;
    private final Gson gson;
    private String hyperswitchUrl;
    private String apiKey;
    private String apiSecret;

    public HyperswitchPaymentPlugin() {
        this.httpClient = new OkHttpClient();
        this.gson = new Gson();
    }

    @Override
    public void start(final BundleContext context) {
        super.start(context);
        // Initialize configuration from plugin properties
        this.hyperswitchUrl = getStringProperty("org.killbill.billing.plugin.hyperswitch.url", "http://hyperswitch:8080");
        this.apiKey = getStringProperty("org.killbill.billing.plugin.hyperswitch.apiKey", "");
        this.apiSecret = getStringProperty("org.killbill.billing.plugin.hyperswitch.apiSecret", "");
    }

    @Override
    public PaymentPluginInfoPaymentMethods getPaymentMethods(final UUID accountId, final boolean refreshFromGateway,
                                                              final Iterable<PluginProperty> properties,
                                                              final TenantContext context) throws PaymentPluginApiException {
        // Return empty list - payment methods are managed through Hyperswitch
        return new PaymentPluginInfoPaymentMethods(ImmutableList.of());
    }

    @Override
    public PaymentPluginInfoPaymentMethods getPaymentMethods(final UUID accountId, final String paymentMethodId,
                                                              final Iterable<PluginProperty> properties,
                                                              final TenantContext context) throws PaymentPluginApiException {
        return new PaymentPluginInfoPaymentMethods(ImmutableList.of());
    }

    @Override
    public PaymentPluginInfoProcessor processPaymentMethods(final UUID accountId,
                                                             final PaymentPluginInfoPaymentMethods paymentMethodsInfo,
                                                             final Iterable<PluginProperty> properties,
                                                             final TenantContext context) throws PaymentPluginApiException {
        return null;
    }

    @Override
    public Payment processPayment(final UUID accountId, final UUID paymentId, final UUID paymentMethodId,
                                   final TransactionType transactionType, final Iterable<PluginProperty> properties,
                                   final CallContext context) throws PaymentPluginApiException {
        try {
            // Build Hyperswitch payment request
            JsonObject request = buildPaymentRequest(accountId, paymentId, transactionType, properties);

            // Call Hyperswitch API
            JsonObject response = callHyperswitch("/payments", "POST", request);

            // Parse and return payment
            return parsePaymentResponse(paymentId, response);

        } catch (Exception e) {
            throw new PaymentPluginApiException(PLUGIN_NAME, "Failed to process payment: " + e.getMessage(), e);
        }
    }

    @Override
    public Payment processRefund(final UUID accountId, final UUID paymentId, final UUID refundId,
                                  final Iterable<PluginProperty> properties,
                                  final CallContext context) throws PaymentPluginApiException {
        try {
            // Build Hyperswitch refund request
            JsonObject request = buildRefundRequest(paymentId, refundId, properties);

            // Call Hyperswitch API
            JsonObject response = callHyperswitch("/refunds", "POST", request);

            // Parse and return payment
            return parseRefundResponse(refundId, response);

        } catch (Exception e) {
            throw new PaymentPluginApiException(PLUGIN_NAME, "Failed to process refund: " + e.getMessage(), e);
        }
    }

    @Override
    public Payment processVoid(final UUID accountId, final UUID paymentId, final UUID voidTransactionId,
                                final Iterable<PluginProperty> properties,
                                final CallContext context) throws PaymentPluginApiException {
        try {
            // Build Hyperswitch void request
            JsonObject request = buildVoidRequest(paymentId, properties);

            // Call Hyperswitch API
            JsonObject response = callHyperswitch("/payments/" + paymentId + "/cancel", "POST", request);

            // Parse and return payment
            return parseVoidResponse(paymentId, response);

        } catch (Exception e) {
            throw new PaymentPluginApiException(PLUGIN_NAME, "Failed to process void: " + e.getMessage(), e);
        }
    }

    @Override
    public void close() {
        // Cleanup resources
    }

    private JsonObject buildPaymentRequest(final UUID accountId, final UUID paymentId,
                                            final TransactionType transactionType,
                                            final Iterable<PluginProperty> properties) {
        JsonObject request = new JsonObject();
        request.addProperty("amount", getAmountFromProperties(properties));
        request.addProperty("currency", getCurrencyFromProperties(properties));
        request.addProperty("payment_id", paymentId.toString());
        request.addProperty("account_id", accountId.toString());
        request.addProperty("connector", "paystack");
        request.addProperty("payment_method", "card");
        request.addProperty("confirmation", "automatic");
        request.addProperty("capture_method", "automatic");
        request.addProperty("setup_future_usage", "off_session");

        // Add billing details
        JsonObject billing = new JsonObject();
        billing.addProperty("email", getEmailFromProperties(properties));
        request.add("billing", billing);

        return request;
    }

    private JsonObject buildRefundRequest(final UUID paymentId, final UUID refundId,
                                           final Iterable<PluginProperty> properties) {
        JsonObject request = new JsonObject();
        request.addProperty("payment_id", paymentId.toString());
        request.addProperty("refund_id", refundId.toString());
        request.addProperty("amount", getRefundAmountFromProperties(properties));
        request.addProperty("reason", "requested_by_customer");

        return request;
    }

    private JsonObject buildVoidRequest(final UUID paymentId,
                                         final Iterable<PluginProperty> properties) {
        JsonObject request = new JsonObject();
        request.addProperty("payment_id", paymentId.toString());
        request.addProperty("cancellation_reason", "requested_by_customer");

        return request;
    }

    private JsonObject callHyperswitch(final String endpoint, final String method,
                                        final JsonObject body) throws Exception {
        Request.Builder requestBuilder = new Request.Builder()
                .url(hyperswitchUrl + endpoint)
                .addHeader("Content-Type", "application/json")
                .addHeader("api-key", apiKey);

        RequestBody requestBody = RequestBody.create(body.toString(), JSON);

        if ("POST".equals(method)) {
            requestBuilder.post(requestBody);
        } else if ("PUT".equals(method)) {
            requestBuilder.put(requestBody);
        }

        try (Response response = httpClient.newCall(requestBuilder.build()).execute()) {
            if (!response.isSuccessful()) {
                throw new Exception("Hyperswitch API error: " + response.code() + " " + response.message());
            }

            String responseBody = response.body().string();
            return gson.fromJson(responseBody, JsonObject.class);
        }
    }

    private Payment parsePaymentResponse(final UUID paymentId, final JsonObject response) {
        // Parse Hyperswitch response and create Kill Bill Payment object
        // This is a simplified version - implement full parsing based on actual Hyperswitch response format
        return null;
    }

    private Payment parseRefundResponse(final UUID refundId, final JsonObject response) {
        // Parse Hyperswitch refund response
        return null;
    }

    private Payment parseVoidResponse(final UUID paymentId, final JsonObject response) {
        // Parse Hyperswitch void response
        return null;
    }

    private Long getAmountFromProperties(final Iterable<PluginProperty> properties) {
        for (PluginProperty property : properties) {
            if ("amount".equals(property.getKey())) {
                return Long.parseLong((String) property.getValue());
            }
        }
        return 0L;
    }

    private String getCurrencyFromProperties(final Iterable<PluginProperty> properties) {
        for (PluginProperty property : properties) {
            if ("currency".equals(property.getKey())) {
                return (String) property.getValue();
            }
        }
        return "NGN";
    }

    private String getEmailFromProperties(final Iterable<PluginProperty> properties) {
        for (PluginProperty property : properties) {
            if ("email".equals(property.getKey())) {
                return (String) property.getValue();
            }
        }
        return "";
    }

    private Long getRefundAmountFromProperties(final Iterable<PluginProperty> properties) {
        for (PluginProperty property : properties) {
            if ("refund_amount".equals(property.getKey())) {
                return Long.parseLong((String) property.getValue());
            }
        }
        return 0L;
    }

    private String getStringProperty(final String key, final String defaultValue) {
        // Get property from plugin configuration
        return defaultValue;
    }
}