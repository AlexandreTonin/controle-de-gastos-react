import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../lib/axios";

interface Transaction {
    id: number
    description: string
    type: 'income' | 'outcome'
    category: string
    price: number
    createdAt: string
}

interface TransactionContextType {
    transactions: Transaction[];
    fetchTransactions: (query?: string) => Promise<void>;
    createTransaction: (data: CreateTransactionInput) => Promise<void>;
}

interface TransactionsProviderProps {
    children: ReactNode;
}

interface CreateTransactionInput {
    description: string;
    category: string;
    price: number;
    type: 'income' | 'outcome';
}

export const TransactionsContext = createContext({} as TransactionContextType);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>([])

    async function fetchTransactions(query?: string) {
        const response = await api.get('/transactions', {
            params: {
                _sort: 'createdAt',
                _order: 'desc',
                q: query
            }
        })

        setTransactions(response.data)
    }

    async function createTransaction(data: CreateTransactionInput) {
        const { description, category, price, type } = data

        const response = await api.post('/transactions', {
            description,
            category,
            price,
            type,
            createdAt: new Date()
        })

        setTransactions(state => [response.data, ...state])
    }

    useEffect(() => {
        fetchTransactions()
    }, [])


    return (
        <TransactionsContext.Provider value={{ transactions, fetchTransactions, createTransaction }}>
            {children}
        </TransactionsContext.Provider>
    )
}