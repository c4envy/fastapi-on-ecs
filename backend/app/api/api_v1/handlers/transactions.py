from datetime import datetime
from uuid import UUID
from fastapi import APIRouter
from app.models.transaction_model import Transaction
from app.schemas.transaction_schema import TransactionObj
from app.services.transactions_service import TransactionService


transaction_router = APIRouter()

@transaction_router.get('/transaction/all', summary="Get all transactions", response_model=list[Transaction])
async def get_transactions():
    return await TransactionService.get_all_transactions()

@transaction_router.get('/transaction/{transaction_id}', summary="Get transaction by id", response_model=Transaction)
async def get_transaction(transaction_id: int):
    return await TransactionService.get_transaction_by_id(transaction_id)

@transaction_router.post('/create/transaction', summary="Create a transaction", response_model=Transaction)
async def create_transaction(transaction: TransactionObj):
    return await TransactionService.create_transaction()

@transaction_router.put('/update/transaction', summary="Update a transaction", response_model=Transaction)
async def update_transaction(transaction_id: UUID, data: TransactionObj):
    return await TransactionService.update_transaction(transaction_id, data)

@transaction_router.delete('/delete/transaction', summary="Delete a transaction")
async def delete_transaction(transaction_id: UUID):
    return await TransactionService.delete_transaction(transaction_id)

@transaction_router.get('/transaction/user/{user_id}', summary="Get all transactions by user", response_model=list[Transaction])
async def get_transactions_by_user(user_id: UUID):
    return await TransactionService.get_transactions_by_user(user_id)

@transaction_router.get('/transaction/payment_method/{payment_method}', summary="Get all transactions by payment method", response_model=list[Transaction])
async def get_transactions_by_payment_method(payment_method: str):
    return await TransactionService.get_transactions_by_payment_method(payment_method)

@transaction_router.get('/transaction/total_price/{total_price}', summary="Get all transactions by total price", response_model=list[Transaction])
async def get_transactions_by_total_price(total_price: float):
    return await TransactionService.get_transactions_by_total_price(total_price)

@transaction_router.get('/transaction/date/{date}', summary="Get all transactions by date", response_model=list[Transaction])
async def get_transactions_by_date(date: datetime):
    return await TransactionService.get_transactions_by_date(date)

@transaction_router.get('/transaction/date_range/{start_date}/{end_date}', summary="Get all transactions by date range", response_model=list[Transaction])
async def get_transactions_by_date_range(start_date: datetime, end_date: datetime):
    return await TransactionService.get_transactions_by_date_range(start_date, end_date)

@transaction_router.get('/transaction/total_price_range/{min_price}/{max_price}', summary="Get all transactions by total price range", response_model=list[Transaction])
async def get_transactions_by_total_price_range(min_price: float, max_price: float):
    return await TransactionService.get_transactions_by_total_price_range(min_price, max_price)

@transaction_router.get('/transaction/date_range_total_price_range/{start_date}/{end_date}/{min_price}/{max_price}', summary="Get all transactions by date range and total price range", response_model=list[Transaction])
async def get_transactions_by_date_range_and_total_price_range(start_date: datetime, end_date: datetime, min_price: float, max_price: float):
    return await TransactionService.get_transactions_by_date_range_and_total_price_range(start_date, end_date, min_price, max_price)



