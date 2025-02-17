"use strict";

let cards = [];
let flippedCards = [];
let matchedCards = 0;
let gameInterval;
let time = 0;
let playerName = '';
let difficulty = 'easy';

function startGame() {

    playerName = document.getElementById('playerName').value;
    console.log(playerName);
    if (playerName === '') {
        alert('名前を入力してください');
        return;
    }

    // ゲームの難易度を取得
    difficulty = document.querySelector('input[name="difficulty"]:checked').value;

    // 初期化
    matchedCards = 0;
    time = 0;
    document.getElementById('time').textContent = `TIME: 0秒`;

    // カードをリセット
    resetGame();

    // ゲーム開始ボタンの非表示
    document.getElementById('setup').style.display = 'none';
    document.getElementById('gameArea').style.display = 'block';

    // スタート画面に戻るボタンの表示
    document.getElementById('returnButton').style.display = 'block';

    // タイマー開始前に既存のタイマーをクリア
    if (gameInterval) {
        clearInterval(gameInterval);
    }

    // 新しいタイマーを設定
    gameInterval = setInterval(() => {
        time++;
        document.getElementById('time').textContent = `TIME: ${time}秒`;
    }, 1000);
}

function resetGame() {
    matchedCards = 0;
    time = 0;
    document.getElementById('time').textContent = `TIME: 0秒`;

    const field = document.getElementById('field');
    field.innerHTML = '';

    // カードのペアを生成してシャッフル
    const cardPairs = generateCardPairs(difficulty);
    shuffle(cardPairs);

    cards = [];
    flippedCards = [];

    cardPairs.forEach((value, index) => {
        const card = document.createElement('div');
        card.classList.add('card', 'back');
        card.setAttribute('data-index', index);
        card.setAttribute('data-value', value);
        card.addEventListener('click', flipCard);
        cards.push(card);
        field.appendChild(card);
    });

    // 既存のタイマーをクリアしてから新しいタイマーを設定
    clearInterval(gameInterval);

    gameInterval = setInterval(() => {
        time++;
        document.getElementById('time').textContent = `TIME: ${time}秒`;
    }, 1000);
}


function generateCardPairs(difficulty) {
    let cardValues = [];
    const totalCards = getTotalCards(difficulty);

    for (let i = 1; i <= totalCards / 2; i++) {
        cardValues.push(i, i); // 同じ数字を2回追加
    }

    return cardValues;
}

function getTotalCards(difficulty) {
    switch (difficulty) {
        case 'easy':
            return 12; // 簡単モードは12枚
        case 'medium':
            return 18; // 普通モードは18枚
        case 'hard':
            return 24; // 難しいモードは24枚
        default:
            return 12;
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // 配列をシャッフル
    }
}

function flipCard() {
    if (flippedCards.length === 2) return; // 2枚以上のカードをめくれない

    const card = this;
    if (flippedCards.includes(card)) return; // すでにめくられているカード

    card.classList.remove('back');
    card.textContent = card.getAttribute('data-value'); // 数字を表示

    flippedCards.push(card);

    // 2枚のカードがめくられた場合
    if (flippedCards.length === 2) {
        const [card1, card2] = flippedCards;
        playerName = document.getElementById('playerName').value;


        if (card1.getAttribute('data-value') === card2.getAttribute('data-value')) {
            // ペアが一致した場合

            matchedCards++;
            setTimeout(() => {
                card1.classList.add('comp');
                card2.classList.add('comp');
                card1.style.opacity = 0; // カードを消す
                card2.style.opacity = 0; // カードを消す
                flippedCards = [];

                if (matchedCards === cards.length / 2) {
                    // ゲームクリア
                    clearInterval(gameInterval);
                    alert(`${playerName}さん、ゲームクリア！\nクリアタイム: ${time}秒`);
                    
                    // 3秒後にスタート画面に戻す
                    setTimeout(() => {
                        returnToStartScreen();
                    }, 1000);
                }
                
            }, 500); 
        } else {
            // 一致しなかった場合
            setTimeout(() => {
                card1.classList.add('back');
                card2.classList.add('back');
                card1.textContent = '';
                card2.textContent = '';
                flippedCards = [];
            }, 400);
        }
    }
}

function togglePause() {
    if (gameInterval) {
        clearInterval(gameInterval); // タイマーを停止
        gameInterval = null;
    } else {
        gameInterval = setInterval(() => {
            time++;
            document.getElementById('time').textContent = `TIME: ${time}秒`;
        }, 1000); // タイマーを再開
    }
}

function returnToStartScreen() {
    document.getElementById('setup').style.display = 'block';
    document.getElementById('gameArea').style.display = 'none';
    clearInterval(gameInterval);
}
