import chalk from "chalk"
import readline from "readline/promises";

const colors = {
    green: chalk.green,
    yellow: chalk.yellow,
    red: chalk.red
}


type ColorStatus = 'green'|'red'|'yellow'

type LetterObject = {
    letter: string
    color: ColorStatus
}

class Wordle  {
    finalWord: string; 
    attempts: number;
    currentAttempt: number = 1;

    constructor(attemts: number) {
        this.finalWord = this.generateWord();
        this.attempts = attemts;
    }

    generateWord(): string {
        return 'read'
    }

    answer(answer: string): boolean {
        if(!this.validAnswer()) return false
        const response = this.checkAnswer(answer);
        const colorfulWord = response.map((l, i) => colors[l.color](l.letter)).join("");
        console.log(colorfulWord)
        this.currentAttempt++;
        return true
    }


    validAnswer(): boolean {
        return this.currentAttempt <= this.attempts
    }

    checkAnswer(answer:string): Array<LetterObject> {
        const result: Array<LetterObject> = []


        for (let i = 0; i < answer.length; i++) {
            const letter = answer[i];
            let color : ColorStatus
            if (letter == this.finalWord[i]) {
                color = 'green'
            }
            else if (this.finalWord.includes(letter)) {
                color = 'yellow'
            }
            else {
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

    async chatLoop() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        try {
            console.log("\nWordle CLI started");
            console.log("Type your guess:");
            while (game.validAnswer()) {
                const message = await rl.question("\nAttempt: ");
                if (message.toLowerCase() === "quit") {
                    break;
                }
                this.game.answer(message);
            }
        } finally {
            rl.close();
        }
    }

}

const game = new Wordle(3)


async function main() {
    const client = new Client(game)
    client.chatLoop()    
}

main();