import { Transaction } from "../../domain/model/Transaction";

const transactionsDB: Transaction[] = [
	new Transaction('Pagamento', 4500, 'ENTRADA', '829dc216-48d7-423f-8fe6-5f7c266bd84a'),
	new Transaction('Compras', 200, 'SAIDA', 'a078df66-4c86-4e8d-8d10-b31d2862b88e'),
	new Transaction('Gasolina', 180, 'SAIDA', 'ab7c2a5a-6061-45a1-aa43-9ee7fce84c63'),
	new Transaction('Mercado', 250, 'SAIDA', 'd7abec52-1428-4943-8098-6685561553c9'),
	new Transaction('Pagamento', 1000, 'ENTRADA', 'b0c00400-4fe7-4014-b800-26f374475c11')
]

export default transactionsDB;