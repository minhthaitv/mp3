const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const pl = $('.progress-line')
const pb = $('#progress-bar')
const pauseBtn = $('.btn-pause')
const playBtn = $('.btn-play')
const listSongs = $('.list-songs')
const headerSongs = $('.header__currentsong')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

var audio
// console.log(songItems)



var app = {
    isRandom: false,
    isRepeat: false,
    currentIndex: 0,
    preset: function () {
        Object.defineProperty(this, 'currentSong', {
            value: this.songs[this.currentIndex],
            writable: true
        })
        pl.style.width = 0
        // audio = $('.audio')
        // audio.load()    
    },
    songs: [
        {
            id: 0,
            name: 'Rubia',
            path: './assets/audio/rubia.mp3',
            author: 'HoyoMix',
            img_path: './assets/img/rubia.jpg'
        },
        {
            id: 1,
            name: 'Befall',
            path: './assets/audio/Befall.mp3',
            author: 'HoyoMix',
            img_path: './assets/img/befall.jpg'
        },
        {
            id: 2,
            name: 'Fathomless Swirls in the Forest',
            path: './assets/audio/Fathomless Swirls in the Forest.mp3',
            author: 'HoyoMix',
            img_path: './assets/img/ayato.jpg'
        }
    ]
    ,
    render: function () {

        //render header
        const header_htmls = `
                <div class="currentsong__img-tag" style="background-image: url(${this.currentSong.img_path});">

                </div>

                <div class="currentsong__info">
                    <div class="currentsong__info-name">
                        ${this.currentSong.name}
                    </div>
                    <div class="currentsong__info-artist">
                        ${this.currentSong.author}
                    </div>
                </div>
                
                <audio class="audio" autoplay>
                    <source src="${this.currentSong.path}" type="audio/ogg">
                </audio>
            </div>
        `
        headerSongs.innerHTML = header_htmls

        
        //render list song
        const htmls = this.songs.map((song) => {
            return `
            <div class="song-item ${app.currentIndex==song.id ? "active" : null}">
            <div class="song-item_icon" style="background-image:url(${song.img_path});"></div>
            <div class="song-item__info">
                <div class="song-item__info-name">
                    ${song.name}
                </div>
                <div class="song-item__info-author">
                    ${song.author}
                </div>
            </div>
            <div class="song-item__option">
                option
            </div>
            </div>
            `
        })
        const add_htmls = htmls.join(' ')
        listSongs.innerHTML = add_htmls


    }
    ,
    handleEvent: function () {
        audio = $('.audio')
        //Progress bar click
        pb.oninput = (e) => {
            pl.style.width = pb.value * pb.offsetWidth / 100 + 'px'
            audio.currentTime = pb.value / 100 * audio.duration
        }

        audio.onplay = function () {
            playBtn.classList.add("pause")
            const img = $('.currentsong__img-tag')
            img.style['animation-play-state'] = 'running'
        }

        audio.onpause = function () {
            playBtn.classList.remove('pause')
            const img = $('.currentsong__img-tag')
            img.style['animation-play-state'] = 'paused'
        }


        //Play button onclick
        playBtn.onclick = () => {
            audio.play()
        }

        //Pause button onclick
        pauseBtn.onclick = () => {
            audio.pause()
        }

        //audio playing
        audio.ontimeupdate = () => {
            pl.style.width =
                (audio.currentTime / audio.duration) * pb.offsetWidth + 'px'
        }

        //next
        nextBtn.onclick = () => {
            if (app.isRandom) {
                let randomIndex
                do{
                    randomIndex = Math.floor(Math.random() * app.songs.length)
                }
                while(app.currentIndex==randomIndex)
                app.currentIndex = randomIndex
                app.updateSong()
            } else {
                this.currentIndex++
                this.updateSong()
            }
        }

        //prev
        prevBtn.onclick = () => {
            if (app.isRandom){
                let randomIndex
                do{
                    randomIndex = Math.floor(Math.random() * app.songs.length)
                }
                while(app.currentIndex==randomIndex)
                app.currentIndex = randomIndex
                app.updateSong()
            }else{
                this.currentIndex--
                this.updateSong()
            }
        }

        //repeat
        repeatBtn.onclick = () => {

            if (this.isRepeat) {
                this.isRepeat = false
                repeatBtn.classList.remove('active')
            } else {
                this.isRepeat = true
                repeatBtn.classList.add('active')
            }
            // console.log('repeat:', this.isRepeat)
        }

        //random
        randomBtn.onclick = () => {

            if (this.isRandom) {
                this.isRandom = false
                randomBtn.classList.remove('active')
            } else {
                this.isRandom = true
                randomBtn.classList.add('active')
            }
            // console.log('random:', this.isRandom)
        }

        audio.onended = function () {
            if (app.isRepeat) {
                audio.load()
            } else {
                app.currentIndex++
                app.updateSong()
            }
        }

        //songItem:
        const songItems = $$('.song-item')
        songItems.forEach((song,index) => {
            song.onclick = ()=>{
                app.currentIndex = index
                app.updateSong()
            }
        });
    },
    updateSong: function () {
        if (app.currentIndex < 0) {
            app.currentIndex = app.songs.length - 1
        }
        if (app.currentIndex > app.songs.length - 1) {
            app.currentIndex = 0
        }
        audio.pause()
        playBtn.classList.add('pause')
        this.preset()
        this.render()
        audio = $('.audio')
        audio.load()
        this.handleEvent()
    },
    start: function () {
        this.preset()
        this.render()
        this.handleEvent()

    }
}

app.start()