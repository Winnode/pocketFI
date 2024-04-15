# pocketFI-miner

PocketFI miner with multiple accounts support

## Installation

To install the pocketFI-miner, follow these steps:

1. Clone the repository to your local machine:
    ```bash
    git clone https://github.com/Winnode/pocketFI.git
    ```
2. Install dependencies (if not already installed):
    ```bash
    npm install axios
    ```
3. Extract raw data from tgweb:
    1. Open [Telegram Web](https://t.me/pocketfi_bot/Mining?startapp=6190010328)
    2. Open DevTools and open web app or F12
    3. Find "telegramRawData" in any request to bot.pocketfi.org
    4. Fill it in the dictionary. You can also add multiple raw datas to mine from all accounts.
	5. paste in accounts.txt sparator enter
	
4. Run the script!
    ```bash
    node main.js
    ```

