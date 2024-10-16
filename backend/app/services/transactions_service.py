from datetime import datetime
from typing import List
from uuid import UUID
from app.models.transaction_model import Transaction
from app.schemas.transaction_schema import TransactionObj


class TransactionService:
    
    @staticmethod
    async def get_transaction_by_id(id: UUID) -> Transaction:
        transaction = await Transaction.find_one(Transaction.transaction_id == id)
        return transaction
    
    @staticmethod
    async def get_transactions_by_user(user_id: UUID) -> List[Transaction]:
        transactions = await Transaction.find(Transaction.buyer_id == user_id).to_list()
        return transactions
    
    @staticmethod
    async def get_all_transactions() -> list[Transaction]:
        transactions = await Transaction.all()
        return transactions
    
    @staticmethod
    async def create_transaction(data: TransactionObj) -> Transaction:
        transaction = await Transaction.insert_one(data)
        return transaction
    
    @staticmethod
    async def get_transactions_by_payment_method(payment_method: str) -> list[Transaction]:
        transactions = await Transaction.find(Transaction.payment_method == payment_method)
        return transactions
    
    @staticmethod
    async def get_transactions_by_total_price(total_price: float) -> list[Transaction]:
        transactions = await Transaction.find(Transaction.total_price == total_price)
        return transactions
    
    @staticmethod
    async def get_transactions_by_date(date: datetime) -> list[Transaction]:
        transactions = await Transaction.find(Transaction.purchase_date == date)
        return transactions
    
    @staticmethod
    async def get_transactions_by_cart_items(cart_items: list) -> list[Transaction]:
        transactions = await Transaction.find(Transaction.cart_items == cart_items)
        return transactions
    
    @staticmethod
    async def get_transactions_by_date_range(start_date: datetime, end_date: datetime) -> list[Transaction]:
        transactions = await Transaction.find(Transaction.purchase_date >= start_date, Transaction.purchase_date <= end_date)
        return transactions
    
    @staticmethod
    async def get_transactions_by_total_price_range(min_price: float, max_price: float) -> list[Transaction]:
        transactions = await Transaction.find(Transaction.total_price >= min_price, Transaction.total_price <= max_price)
        return transactions
    
    @staticmethod
    async def get_transactions_by_date_range_and_total_price_range(start_date: datetime, end_date: datetime, min_price: float, max_price: float) -> list[Transaction]:
        transactions = await Transaction.find(Transaction.purchase_date >= start_date, Transaction.purchase_date <= end_date, Transaction.total_price >= min_price, Transaction.total_price <= max_price)
        return transactions
    
    # @staticmethod
    # async def get_transactions_by_payment_method_and_date(payment_method: str, date: datetime) -> list[Transaction]:
    #     transactions = await Transaction.find(Transaction.payment_method == payment_method, Transaction.purchase_date == date)
    #     return transactions
    
    # @staticmethod
    # async def get_transactions_by_payment_method_and_total_price(payment_method: str, total_price: float) -> list[Transaction]:
    #     transactions = await Transaction.find(Transaction.payment_method == payment_method, Transaction.total_price == total_price)
    #     return transactions
    
    @staticmethod
    async def get_transactions_by_payment_method_and_date_range(payment_method: str, start_date: datetime, end_date: datetime) -> list[Transaction]:
        transactions = await Transaction.find(Transaction.payment_method == payment_method, Transaction.purchase_date >= start_date, Transaction.purchase_date <= end_date)
        return transactions
    
    @staticmethod
    async def get_transactions_by_payment_method_and_total_price_range(payment_method: str, min_price: float, max_price: float) -> list[Transaction]:
        transactions = await Transaction.find(Transaction.payment_method == payment_method, Transaction.total_price >= min_price, Transaction.total_price <= max_price)
        return transactions
    
    @staticmethod
    async def get_transactions_by_publisher(publisher: str) -> list[Transaction]:
        transactions = await Transaction.find(Transaction.cart_items.publisher == publisher)
        return transactions
    
    @staticmethod
    async def get_transactions_by_artist(artist_name: str) -> list[Transaction]:
        transactions = await Transaction.find(Transaction.cart_items.artist_name == artist_name)
        return transactions
    
    @staticmethod
    async def delete_transaction(id: UUID) -> None:
        transaction = await Transaction.find_one(Transaction.transaction_id == id)
        await transaction.delete()
        
    @staticmethod
    async def update_transaction(id: UUID, data: TransactionObj) -> Transaction:
        transaction = await Transaction.find_one(Transaction.transaction_id == id)
        await transaction.update(data.dict(exclude_unset=True))
        return transaction