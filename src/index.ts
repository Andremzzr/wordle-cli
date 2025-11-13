import chalk from "chalk"

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

    answer (answer: string) {
        const response = this.checkAnswer(answer);

        
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