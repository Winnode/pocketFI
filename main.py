import requests
import time

def get_headers(raw_data):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6332.212 Safari/537.36',
        'telegramRawData': raw_data,
        'Referer': 'https://botui.pocketfi.org/',
        'Origin': 'https://botui.pocketfi.org',
        'Connection': 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
    }
    return headers

show = input('Show account id? (y/n): ')

session = requests.Session()
last_claim_times = {}  # Dictionary to store the last claim times for each account

def mine(raw_data):
    current_time = time.time()
    for data in raw_data:
        if data in last_claim_times and current_time - last_claim_times[data] < 3600:  # Check if it's been less than one hour
            continue  # Skip this cycle if the account has claimed in the last hour
        
        headers = get_headers(data)
        response = session.get('https://bot.pocketfi.org/mining/getUserMining', headers=headers)
        if response.status_code == 200:
            json_response = response.json()
            json = json_response["userMining"]
            print(f'{("[Account " + str(json["userId"]) + "]") if show == "y" else ""}Request sent. Balance: {json["gotAmount"]}/{json["miningAmount"]} SWITCH Current speed: {json["speed"]} switch/hour')
            if json["miningAmount"] >= 1.25:
                response = session.post('https://bot.pocketfi.org/mining/claimMining', headers=headers)
                if response.status_code == 200:
                    print(f'{("[Account " + str(json["userId"]) + "]") if show == "y" else ""}Claimed {json["miningAmount"]} SWITCH')
                    last_claim_times[data] = current_time  # Update the last claim time
            return
        else:
            print('Error: PocketFI is down. Received status code:', response.status_code)
            return
        
def main():
    try:
        with open('accounts.txt', 'r') as file:
            raw_data = file.read().splitlines()
        while True:
            mine(raw_data)
            time.sleep(30)
    except Exception as e:
        print('Error:', e)

if __name__ == "__main__":
    main()
