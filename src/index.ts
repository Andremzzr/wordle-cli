import chalk from "chalk"

const WORD_API_URL = "https://random-word-api.vercel.app/api?words=1"

type WordAPIResponse = Array<string>

class APIService {
    url: string

    constructor(url:string) { 
        this.url=url;
    }


    async fetchData(): Promise<string>  { 
        const response = await fetch(this.url);
        const data:  WordAPIResponse = await response.json();

        return data[0]
    }
}
const colors = {
    green: chalk.green,
    yellow: chalk.yellow,
    red: chalk.red
}


type ColorStatus = 'green'|'red'|'yellow'
type AnswerObject = { [key: string]: number[] }
type LetterObject = {
    letter: string
    color: ColorStatus
}

class Wordle  {
    finalWord : string = '';
    finalWordObject: AnswerObject = {}; 
    maxAttempts: number;
    currentAttempt: number = 1;
    wordService: APIService

    constructor(attemts: number) {
        this.wordService = new APIService(WORD_API_URL)
        this.maxAttempts = attemts;
    }

    async getWord() {              
        this.finalWord = await this.generateWord(); 
        console.log(this.finalWord)
        this.finalWordObject = this.stringToCharIndexMap(this.finalWord);
    }

    private async generateWord(): Promise<string> {
        return await this.wordService.fetchData();
    }

    answer(answer: string): boolean {
        if(!this.validAnswer()) return false
        const response = this.checkAnswer(answer);
        const colorfulWord = response.map((l, i) => colors[l.color](l.letter)).join("");
        console.log(colorfulWord)
        this.currentAttempt++;
        if(answer == this.finalWord) {
            console.log("Good job! You guessed the word!");
            this.currentAttempt = this.maxAttempts + 1
        }
        return true
    }

    stringToCharIndexMap(inputString: string): { [key: string]: number[] } {
        const charIndexMap: { [key: string]: number[] } = {};

        for (let i = 0; i < inputString.length; i++) {
            const char = inputString[i];
            if (charIndexMap[char]) {
            charIndexMap[char].push(i);
            } else {
            charIndexMap[char] = [i];
            }
        }

        return charIndexMap;
    }

    validAnswer(): boolean {
        return this.currentAttempt <= this.maxAttempts
    }

    checkAnswer(answer:string): Array<LetterObject> {
        const result: Array<LetterObject> = []


        for (let i = 0; i < answer.length; i++) {
            const letter = answer[i];
            let color : ColorStatus

            if (this.finalWordObject[letter]) {
                color = 'yellow'
                for (const index of this.finalWordObject[letter]) {
                    if(index == i) {
                        color = 'green'
                    } else if (result.filter(o => o.letter == letter && o.color == 'green').length == this.finalWordObject[letter].length) {
                        color = 'red'
                    }
                }
            } else {
                color = 'red'
            }


            result.push( {
                letter,
                color
            })
        }

        return result
    }

}


class Client  {
    game: Wordle
    constructor (game: Wordle) {
        this.game = game;
    }

    async typeAnswer(maxChar: number): Promise<string> {
        return new Promise((resolve) => {
            let buffer: string[] = [];

            const stdin = process.stdin;
            stdin.setRawMode(true);
            stdin.resume();
            stdin.setEncoding("utf8");


            const handler = (key: string) => {
                    // Exit on Ctrl+C
                if (key === "\u0003") process.exit();

                // ENTER → finish
                if (key === "\r") {
                    stdin.setRawMode(false);
                    stdin.pause();
                    stdin.removeListener("data", handler);   // 🔥 FIX
                    return resolve(buffer.join(""));
                }

                // BACKSPACE
                if (key === "\u0008" || key === "\u007F") {
                    if (buffer.length > 0) {
                        buffer.pop();
                        process.stdout.write("\b \b");
                    }
                    return;
                }

                // Accept letters only
                if (/^[a-zA-Z]$/.test(key)) {
                    if (buffer.length < maxChar) {
                        buffer.push(key);
                        process.stdout.write(key);
                    }
                    return;
                }

            }

            stdin.on("data", handler)
        });
    }


    async chatLoop() {

        try {
            console.log("\nWordle CLI started");
            console.log("Type your guess:");
            while (this.game.validAnswer()) {
                const message = await this.typeAnswer(this.game.finalWord.length);
                if (message.toLowerCase() === "quit") {
                    break;
                }
                console.log('\n')
                this.game.answer(message);
            }
            
        } catch (err) {
            console.log(err)
        }
    }

}


async function main() {
    const game = new Wordle(3)
    await game.getWord();
    const client = new Client(game)

    client.chatLoop()    
}

main();




