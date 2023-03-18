import axios from "axios"

export default function Home() {
	const handleTransfer = () => axios.get("http://localhost:3000/api/nft")

	return (
		<div>
			<button onClick={handleTransfer}>
				Click this button to transfer the token
			</button>
		</div>
	)
}
