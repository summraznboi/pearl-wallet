# Connect to the Pearl Wallet

"Connecting" or "logging in" to Pearl Wallet effectively means "to access the user's Bitcoin account(s)".

You should only initiate a connection request in response to direct user action, such as clicking a button. You should always disable the "connect" button while the connection request is pending. You should never initiate a connection request on page load.

We recommend that you provide a button to allow the user to connect Pearl Wallet to your dapp. Clicking this button should call the following method:

## Methods

### requestAccounts

```
unisat.requestAccounts()
```

Connect the current account.

**Parameters**

none

**Returns**

- `Promise` returns `string[]` : Address of current account.

```javascript
try {
  let accounts = await window.unisat.requestAccounts();
  console.log('connect success', accounts);
} catch (e) {
  console.log('connect failed');
}
> connect success ['tb1qrn7tvhdf6wnh790384ahj56u0xaa0kqgautnnz']
```

---

### disconnect

```
unisat.disconnect()
```

Disconnect the current account.

**Parameters**

none

**Returns**

- `Promise` returns `void`

```javascript
window.unisat.disconnect();
```
