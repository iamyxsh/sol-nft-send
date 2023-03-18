import { NextApiRequest, NextApiResponse } from "next"
import bs58 from "bs58"
import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js"
import {
	transferChecked,
	getMint,
	getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token"

const decodedSeed = bs58.decode(process.env.NEXT_APP_PRIVATE_KEY!).slice(0, 32)
const keypair = Keypair.fromSeed(decodedSeed)

const connection = new Connection(clusterApiUrl("mainnet-beta"))

const TOKEN_MINT_ACC = "RJ3jico4zf5ow7yuJTmtZVmTccX8cQ3SXaJgxj82Hv8"
const TO_ADDRESS = "8MdXvWgNou9jRVturbfnt3egf1aP9p1AjL8wiJavti7F"
const TOKEN_ACC_FROM = "FBzCHyth2fm7xCFHMyYSkwtF541EdeVdg1NN4Ejpasvz"

export default async function handler(
	_: NextApiRequest,
	res: NextApiResponse<String>
) {
	try {
		const mintAcc = await getMint(connection, new PublicKey(TOKEN_MINT_ACC))
		let ata = await getOrCreateAssociatedTokenAccount(
			connection,
			keypair,
			mintAcc.address,
			new PublicKey(TO_ADDRESS)
		)
		await transferChecked(
			connection,
			keypair,
			new PublicKey(TOKEN_ACC_FROM),
			mintAcc.address,
			ata.address,
			keypair,
			1,
			0
		)

		res.status(200).send("nft sent")
	} catch (err) {
		console.log(err)
		res.status(500).send("there was an error")
	}
}
