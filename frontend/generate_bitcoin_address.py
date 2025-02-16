import bitcoin

private_key = bitcoin.random_key()

public_key = bitcoin.privkey_to_pubkey(private_key)

bitcoin_address = bitcoin.pubkey_to_address(public_key)

print("Private Key: " + private_key)
print("Public Key: " + public_key)
print("Bitcoin Address: " + bitcoin_address)
