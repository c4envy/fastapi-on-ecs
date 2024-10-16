from fastapi import APIRouter, Query
from app.services.stripe_service import PaymentIntentRequest, StripeService


stripe_router = APIRouter()

@stripe_router.post('/create_payment_intent', summary="Create a payment intent")
async def create_payment_intent(payment_intent_request: PaymentIntentRequest):
    return await StripeService.create_payment_intent(payment_intent_request)

@stripe_router.post('/create_payment_intent_', summary="Create a payment intent")
async def create_payment_intent(amount: str = Query(..., description="Account ID"),
                                currency: str = Query(..., description="Currency"),
                                payment_method: str = Query(..., description="Payment Method ID")):
    # Assuming PaymentIntentRequest is a Pydantic model used as the request body
    # payment_intent_request = PaymentIntentRequest(...)  # Create the request object here
    return await StripeService.create_payment_intent_( amount, currency, payment_method)


# @stripe_router.post('/create_setup_intent', summary="Create a setup intent")
# async def create_setup_intent(customer_id: str):
#     return await StripeService.create_setup_intent(customer_id)


@stripe_router.post('/create_customer', summary="Create a customer")
async def create_customer(email: str, payment_method: str):
    return await StripeService.create_customer(email, payment_method)

# @stripe_router.post('/create_subscription', summary="Create a subscription")
# async def create_subscription(customer_id: str, price_id: str):
#     return await StripeService.create_subscription(customer_id, price_id)

# @stripe_router.post('/create_checkout_session', summary="Create a checkout session")
# async def create_checkout_session(customer_id: str, price_id: str):
#     return await StripeService.create_checkout_session(customer_id, price_id)



@stripe_router.post('/create_price', summary="Create a price")
async def create_price(product_id: str, unit_amount: int, currency: str):
    return await StripeService.create_price(product_id, unit_amount, currency)

@stripe_router.post('/create_product', summary="Create a product")
async def create_product(name: str):
    return await StripeService.create_product(name)

@stripe_router.get('/get_all_payment_methods', summary="Get all payment methods")
async def get_payment_methods():
    return await StripeService.get_all_payment_methods()

# @stripe_router.post('/create_tax_rate', summary="Create a tax rate")
# async def create_tax_rate(display_name: str, percentage: float):
#     return await StripeService.create_tax_rate(display_name, percentage)