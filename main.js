// render music
// resize cd 
// get currentSong
// handle play, pause, seek
// cd rotate
// handle next, prev 
// random
// next/ repeat when ended
// active song
// scroll active song into view
// play song when click

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const playlist = $('.playlist')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const player = $('.player')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    isRepeat: false,
    isRandom: false,
    isPlaying: false,
    currentIndex: 0,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Hoa Mặt Trời",
            singer: "Hoàng Yến",
            path: "./assets/music/song1.mp3",
            image: "./assets/img/song1.jpg"
        },
        {
            name: "HANAVA",
            singer: "CAMILA CABELLO",
            path: "./assets/music/song2.mp3",
            image: "./assets/img/song2.jpg"
        },
        {
            name: "Đừng Như Thói Quen",
            singer: "JayKII",
            path: "./assets/music/song3.mp3",
            image: "./assets/img/song3.jpg"
        },
        {
            name: "Anh Không Muốn Bất Công Với Em",
            singer: "Mikenko",
            path: "./assets/music/song4.mp3",
            image: "./assets/img/song4.jpg"
        },
        {
            name: "Chuột Yêu Gạo",
            singer: "Khởi My",
            path: "./assets/music/song5.mp3",
            image: "./assets/img/song5.jpg"
        },
        {
            name: "Một Bước Đi Vạn Dặm Đau",
            singer: "Mr. Siro",
            path: "./assets/music/song6.mp3",
            image: "./assets/img/song6.jpg"
        },
        {
            name: 'See Tình',
            singer: 'Hoang Thuy Linh',
            path: './assets/music/song7.mp3',
            image: './assets/img/song7.jpg',
        },
        {
            name: 'Cảm Ơn Vì Tất Cả',
            singer: 'Anh Quân Idol',
            path: './assets/music/song8.mp3',
            image: './assets/img/song8.jpg',
        },
        {
            name: 'Anh Mệt Rồi',
            singer: 'Anh Quân Idol',
            path: './assets/music/song9.mp3',
            image: './assets/img/song9.jpg',
        },
        {
            name: 'Hoa Cỏ Lau',
            singer: 'Phong Max',
            path: './assets/music/song10.mp3',
            image: './assets/img/song10.jpg',
        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    defineProperty: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },
    renderMusic: function () {
        const html = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = html.join('')
    },
    handleEvent: function () {
        const _this = this
        // resize cd
        const cdWidth = cd.offsetWidth
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // handle cd rotate
        const cdThumbanimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ], {
            duration: 10000,
            iterations: Infinity,
        })
        cdThumbanimate.pause()

        // handle play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // handle when music play
        audio.onplay = function () {
            _this.isPlaying = true
            cdThumbanimate.play()
            player.classList.add('playing')
        }

        // handle when music pause 
        audio.onpause = function () {
            _this.isPlaying = false
            cdThumbanimate.pause()
            player.classList.remove('playing')
        }

        // return progress of music
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // handle seek
        progress.oninput = function (e) {
            const seekTime = e.target.value * audio.duration / 100
            audio.currentTime = seekTime
        }

        // handle next
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.renderMusic()
            _this.scrollToActiveSong()
        }

        // handle prev
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.renderMusic()
            _this.scrollToActiveSong()
        }

        // turn on/off randomBtn
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // handle next when music ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // turn on/off repeatBtn
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)

        }

        // play song when click
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')

            if (songNode || e.target.closest('.option')) {
                // Handle when click on song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.renderMusic()
                    audio.play()
                }

                // handle when click on option btn
                if (e.target.closest('.option')) {
                    alert('chuc nang dang cap nhat')
                }
            }
        }
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 300)
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    randomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex

        this.loadCurrentSong()
    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    start: function () {
        this.loadConfig()

        this.defineProperty()

        this.handleEvent()

        this.loadCurrentSong()

        this.renderMusic()

        repeatBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active', this.isRandom)
    }
}

app.start()