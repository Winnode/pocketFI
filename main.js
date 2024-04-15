const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

const apiUrl = 'https://bot.pocketfi.org/mining';
const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.6332.212 Safari/537.36',
    'Referer': 'https://botui.pocketfi.org/',
    'Origin': 'https://botui.pocketfi.org',
    'Connection': 'keep-alive',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-site',
};

let lastClaimTimes = {};

async function readInput(prompt) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => {
        rl.question(prompt, answer => {
            rl.close();
            resolve(answer);
        });
    });
}

async function mine(data, showId) {
    if (lastClaimTimes[data] && (Date.now() - lastClaimTimes[data] < 3600000)) {
        console.log('Wait for the 1-hour delay after the last claim.');
        return;
    }

    try {
        const getUserMining = await axios.get(`${apiUrl}/getUserMining`, { headers: { ...headers, 'telegramRawData': data } });
        if (getUserMining.status_code === 200) {
            const json = getUserMining.data.userMining;
            console.log(`${showId ? "[Account " + json.userId + "]" : ""} Request sent. Balance: ${json.gotAmount}/${json.miningAmount} SWITCH Current speed: ${json.speed} switch/hour`);

            if (json.miningAmount >= 1.25) {
                const claimMining = await axios.post(`${apiUrl}/claimMining`, {}, { headers: { ...headers, 'telegramRawData': data } });
                if (claimMining.status_code === 200) {
                    console.log(`${showId ? "[Account " + json.userId + "]" : ""} Claimed ${json.miningAmount} SWITCH`);
                    lastClaimTimes[data] = Date.now();
                }
            }
        }
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

(async function() {
    const show = await readInput('Show account id? (y/n): ');
    const showId = show.toLowerCase() === 'y';

    const raw_data = fs.readFileSync('accounts.txt', 'utf-8').split('\n').filter(line => line.trim());

    while (true) {
        for (let data of raw_data) {
            await mine(data, showId);
        }
        await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds delay
    }
})();
