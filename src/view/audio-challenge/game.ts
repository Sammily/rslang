import { IUserAnswers, IWords } from '../../app/interfaces';
import { getWord, getWords } from '../../controller/fetch';

const serverName = 'https://rs-lang2022.herokuapp.com/';
// const serverName = 'http://localhost:3000/';

class AudioChallengeGame {
    langLevels: string[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

    selectedLevel = 0;

    value = 0;

    data: IWords[] = [];

    wordData!: IWords;

    allWords: object[] = [];

    taken: string[] = [];

    hearts = 5;

    page = 0;

    group = 0;

    id = '';

    currentWord = 0;

    userAnswers: IUserAnswers[] = [];

    correctAnswers: IWords[] = [];

    rightWord = '';

    getData(): Promise<void> {
        return (async () => {
            this.data = await getWords(this.page, this.group);
        })();
    }

    getWordData(): Promise<void> {
        return (async () => {
            this.wordData = await getWord(this.id);
        })();
    }

    drawDefault(): void {
        const wrap: HTMLElement | null = document.getElementById('audio-challenge__wrapper');
        const h2: HTMLElement = document.createElement('h2');
        h2.innerText = 'Аудио-вызов';
        const h6: HTMLElement = document.createElement('h6');
        h6.innerText = 'Улучши своё восприятие речи на слух!';
        const h5: HTMLElement = document.createElement('h5');
        h5.innerText = 'Выбери уровень сложности:';
        const btnSection: HTMLElement = document.createElement('section');
        btnSection.id = 'lang-levels-buttons';
        btnSection.className = 'lang-levels-buttons__container';
        const btnStart: HTMLButtonElement = document.createElement('button');
        btnStart.id = 'start-btn';
        btnStart.className = 'button button_white btn-start';
        btnStart.textContent = 'Начать игру';
        btnStart.addEventListener('click', async () => {
            // console.log('start');
            this.draw(this.selectedLevel);
            this.drawWords();
        });
        wrap?.appendChild(h2);
        wrap?.appendChild(h6);
        wrap?.appendChild(h5);
        wrap?.appendChild(btnSection);
        wrap?.appendChild(btnStart);
        const fragment: DocumentFragment = document.createDocumentFragment();

        this.langLevels.forEach((langLevel, index) => {
            const btn: HTMLButtonElement = document.createElement('button');
            btn.id = `level-btn-${index}`;
            btn.value = `${index}`;
            btn.className = 'button button_white level-btn';
            btn.textContent = langLevel;
            btn.addEventListener('click', () => {
                console.log(btn.value);
                this.selectedLevel = +btn.value;
            });
            fragment.appendChild(btn);
        });
        btnSection.appendChild(fragment);
    }

    async draw(value: number): Promise<void> {
        this.group = value - 1;
        const wrap: HTMLElement | null = document.getElementById('audio-challenge__wrapper');
        if (wrap) {
            while (wrap.firstChild) {
                wrap.removeChild(wrap.firstChild);
            }
        }
        const heartSection: HTMLElement = document.createElement('section');
        heartSection.id = 'hearts';
        const wordsSection: HTMLElement = document.createElement('section');
        wordsSection.id = 'words-section';

        for (let i = 0; i < this.hearts; i += 1) {
            const heart: HTMLElement = document.createElement('span');
            heart.innerHTML = `<svg width="47" height="40" viewBox="0 0 47 40" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <rect width="47" height="40" fill="url(#pattern0)"/>
            <defs><pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
            <use xlink:href="#image0_9475_676" transform="scale(0.0212766 0.025)"/></pattern>
            <image id="image0_9475_676" width="47" height="40" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAoCAYAAABuIqMUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFF2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wOC0xOVQxMzo1NzoxOSswMzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMDgtMTlUMTQ6MDM6MTErMDM6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjItMDgtMTlUMTQ6MDM6MTErMDM6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTRmYjdmYTQtYTIxMy0yMTQxLWJiMTItODdhZGJlNzdlNWRhIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjU0ZmI3ZmE0LWEyMTMtMjE0MS1iYjEyLTg3YWRiZTc3ZTVkYSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjU0ZmI3ZmE0LWEyMTMtMjE0MS1iYjEyLTg3YWRiZTc3ZTVkYSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NTRmYjdmYTQtYTIxMy0yMTQxLWJiMTItODdhZGJlNzdlNWRhIiBzdEV2dDp3aGVuPSIyMDIyLTA4LTE5VDEzOjU3OjE5KzAzOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuNCAoV2luZG93cykiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+TJJKNgAAAQZJREFUWIXtWVsShCAMK8webC+y9z8GfrmDDo+WpkIZ8+eIaRILMhjS90cNpNbNDIE5Dsr9URLfx3NMwLgjgFzyLJT7Ll5D3uOAc8faDWQRK+5S26CLIIVfuGN+4Q2WyRMZh2It3hIpktOWIfKd/Ct+Gl7xs+Be/MhefAUE98m7xSneW+sEok2SJ/KT/l/nNskTrZ/+RV8p+VUNsI4+igMno6hnq57PsUr6VR295GcbaNbntM0sA9263J5/2gCrnmTCPmWAXUe62lgbEPGPLJVBWkTAK4JmnUcZGA5D+5HSGlA9j/jCjgpQv7naPykpTiGcc0/YfEHvbXrCoBPdYmNWm4DwFeoA3nscA2tKgbsAAAAASUVORK5CYII="/>
            </defs></svg>`;
            heart.id = `heart-${i}`;
            heart.className = 'hearts';
            heartSection.appendChild(heart);
        }
        if (wrap) {
            wrap.appendChild(heartSection);
        }
        const audioSection: HTMLElement = document.createElement('section');
        audioSection.id = 'play';
        const audio = document.createElement('audio');
        const audioSrc: HTMLSourceElement = document.createElement('source');
        audioSrc.id = 'audio-src';
        audioSrc.src = '';
        wrap?.appendChild(audioSection);
        audioSection?.appendChild(audio);
        audio?.appendChild(audioSrc);
        const wordDetailsSection: HTMLElement = document.createElement('section');
        wordDetailsSection.id = 'word-details';
        wrap?.appendChild(wordDetailsSection);
        if (wrap) {
            wrap.appendChild(wordsSection);
        }
        const fragment: DocumentFragment = document.createDocumentFragment();
        const answerBtn: HTMLButtonElement = document.createElement('button');
        answerBtn.id = 'answer-btn';
        answerBtn.textContent = 'Не знаю :(';
        for (let i = 0; i < 5; i += 1) {
            const btn: HTMLButtonElement = document.createElement('button');
            btn.id = `word-btn-${i}`;
            btn.classList.add('button', 'button_white', 'word_button');
            btn.addEventListener('click', () => {
                const word = this.data.find((item) => item.id === this.rightWord);
                if (word) {
                    console.log(word);
                    this.userAnswers.push({ word, guessedRight: false });
                }
                // console.log('userAnswers', this.userAnswers);
                // console.log('btn.id', btn.id);
                if (this.rightWord === btn.id) {
                    btn.style.backgroundColor = 'rgba(0, 184, 148, 1)';
                } else {
                    if (this.hearts === 0) {
                        console.log('gameover');
                        this.showResults();
                    } else {
                        this.hearts -= 1;
                        const heart = document.getElementById(`heart-${this.hearts}`);
                        if (heart) {
                            heart.classList.add('hide');
                        }
                    }
                    btn.style.backgroundColor = '#ff405d';
                    const rigthBtn = document.getElementById(this.rightWord);
                    if (rigthBtn) {
                        rigthBtn.style.backgroundColor = 'rgba(0, 184, 148, 1)';
                    }
                }
                this.drawWordDetails();
                answerBtn.textContent = 'Дальше';
                answerBtn.style.backgroundColor = '#ffffff';
                answerBtn.style.color = '#000000';
                const btns: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.word_button');
                /* eslint-disable-next-line */
                for (const elem of btns) {
                    elem.disabled = true;
                }
            });
            fragment.appendChild(btn);
        }
        wordsSection.appendChild(fragment);
        answerBtn.addEventListener('click', () => {
            if (answerBtn.textContent === 'Не знаю :(') {
                if (this.hearts === 0) {
                    console.log('gameover');
                    this.showResults();
                } else {
                    this.hearts -= 1;
                    const heart = document.getElementById(`heart-${this.hearts}`);
                    if (heart) {
                        heart.classList.add('hide');
                    }
                }
                this.userAnswers.push({
                    word: this.correctAnswers[this.correctAnswers.length - 1],
                    guessedRight: true,
                });
                console.log(this.userAnswers);
                this.drawWordDetails();
                answerBtn.textContent = 'Дальше';
                answerBtn.style.backgroundColor = '#ffffff';
                answerBtn.style.color = '#000000';
                const rigthBtn: HTMLElement | null = document.getElementById(this.rightWord);
                if (rigthBtn) {
                    rigthBtn.style.backgroundColor = 'rgba(0, 184, 148, 1)';
                }
                const btns: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.word_button');
                /* eslint-disable-next-line */
                for (const elem of btns) {
                    elem.disabled = true;
                }
            } else if (this.hearts === 0) {
                console.log('gameover');
                this.showResults();
            } else {
                answerBtn.textContent = 'Не знаю :(';
                answerBtn.style.backgroundColor = '#ff405d';
                this.drawWords();
                this.hideWordDetails();
                const btns: NodeListOf<HTMLButtonElement> = document.querySelectorAll('.word_button');
                /* eslint-disable-next-line */
                for (const elem of btns) {
                    elem.disabled = false;
                }
            }
        });
        answerBtn.classList.add('button', 'button_colored');
        wrap?.appendChild(answerBtn);
    }

    async drawWords(): Promise<void> {
        await this.getData();
        this.taken = [];
        const wordBtns: HTMLCollectionOf<Element> = document.getElementsByClassName('button button_white word_button');
        if (this.currentWord > 19) {
            this.page += 1;
            await this.getData();
            this.currentWord = 0;
        }
        for (let i = this.currentWord, j = 0; i < this.currentWord + 5; i += 1, j += 1) {
            if (wordBtns[j]) {
                (wordBtns[j] as HTMLButtonElement).style.backgroundColor = '#ffffff';
                wordBtns[j].textContent = this.data[i].wordTranslate;
                // wordBtns[j].textContent = this.data[i].id;
                wordBtns[j].id = this.data[i].id;
                // this.answer = this.data[i];
            }
            if (this.data[i] === undefined) {
                return;
            }
            this.taken.push(this.data[i].id);
            this.currentWord += 1;
            if (j === 4) {
                this.rightWord = this.taken[this.getRandomNumberFrom0to4()];
                const word = this.data.find((item) => item.id === this.rightWord);
                if (word) {
                    this.correctAnswers.push(word);
                }
                this.playAudio();
            }
        }
    }

    getRandomNumberFrom0to4(): number {
        return Math.floor(Math.random() * 5);
    }

    playAudio(): void {
        const audio: HTMLAudioElement = new Audio();
        const index: number = this.correctAnswers.length - 1;
        audio.src = `${serverName}${this.correctAnswers[index].audio}`;
        audio.play();
    }

    async drawWordDetails(): Promise<void> {
        const index: number = this.correctAnswers.length - 1;
        const wordDetailsSection: HTMLElement | null = document.getElementById('word-details');
        wordDetailsSection?.classList.remove('hide');
        if (wordDetailsSection) {
            while (wordDetailsSection.firstChild) {
                wordDetailsSection.removeChild(wordDetailsSection.firstChild);
            }
        }
        const image: HTMLImageElement = document.createElement('img');
        image.id = 'word-image';
        image.src = `${serverName}${this.correctAnswers[index].image}`;
        image.addEventListener('click', () => {
            this.playAudio();
        });
        const details: HTMLElement = document.createElement('span');
        if (this.correctAnswers[index] === undefined) {
            return;
        }
        details.innerHTML = `<b>${this.correctAnswers[index].word}</b> ${this.correctAnswers[index].transcription}`;
        if (wordDetailsSection) {
            wordDetailsSection.appendChild(image);
            wordDetailsSection.appendChild(details);
        }
    }

    hideWordDetails(): void {
        const wordDetailsSection: HTMLElement | null = document.getElementById('word-details');
        wordDetailsSection?.classList.add('hide');
    }

    async showResults(): Promise<void> {
        const wrap: HTMLElement | null = document.getElementById('audio-challenge__wrapper');
        if (wrap) {
            while (wrap.firstChild) {
                wrap.removeChild(wrap.firstChild);
            }
        }
        const resultsWrap: HTMLElement = document.createElement('div');
        resultsWrap.id = 'results-wrap';
        wrap?.appendChild(resultsWrap);
        const playAgainBtn: HTMLButtonElement = document.createElement('button');
        playAgainBtn.id = 'play-again-btn';
        playAgainBtn.textContent = 'Ещё раз';
        playAgainBtn.classList.add('button', 'button_white', 'word_button');
        playAgainBtn.addEventListener('click', () => {
            console.log('play again');
            wrap?.removeChild(resultsWrap);
            wrap?.removeChild(playAgainBtn);
            this.drawDefault();
            this.hearts = 5;
            this.userAnswers = [];
        });
        wrap?.appendChild(playAgainBtn);
        const resultsList: HTMLElement = document.createElement('ul');
        resultsList.id = 'results-list';
        resultsWrap.appendChild(resultsList);
        for (let i = 0; i < this.userAnswers.length; i += 1) {
            const resultsItem: HTMLElement = document.createElement('li');
            resultsItem.classList.add('word-in-list');
            resultsItem.innerHTML = `<b>${this.userAnswers[i].word.word}</b> - ${this.userAnswers[i].word.wordTranslate}`;

            resultsList.appendChild(resultsItem);
        }
    }
}

export default AudioChallengeGame;
