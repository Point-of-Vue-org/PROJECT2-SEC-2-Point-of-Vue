import { getPlanBy, getPlansBy } from "../libs/planManagement"

const defaultUserData = {
    id: undefined,
    hasSetup: false,
    username: '',
    nickname: '',
    email: '',
    password: '',
    setting: {
        avatarUrl: '',
        bannerUrl: ''
    },
    bio: '',
    upVotes: 0,
    postCount: 0,
    upVotedPlans: [],
    downVotedPlans: [],
    upVotedComments: [],
    downVotedComments: [],
}

export class User {
    constructor(userData = {}) {
        for (let key in defaultUserData) {
            // if (typeof defaultUserData[key] === 'object' &&
            //     !Array.isArray(defaultUserData[key]) &&
            //     typeof userData[key] === 'object' &&
            //     !Array.isArray(userData[key])
            // ) {
            //     for (let subKey in defaultUserData[key]) {
            //         this[key][subKey] = userData[key][subKey] || defaultUserData[key][subKey]
            //     }
            //     continue
            // }
            this[key] = userData[key] || defaultUserData[key]
        }
        // this = { ...defaultUserData, ...userData }
    }

    setUsername(username) {
        this.username = username
    }

    setNickname(nickname) {
        this.nickname = nickname
    }

    setEmail(email) {
        this.email = email
    }

    setPassword(password) {
        this.password = password
    }

    setBio(bio) {
        this.bio = bio
    }

    setAvatar(avatarUrl) {
        this.setting.avatarUrl = avatarUrl
    }

    setBanner(bannerUrl) {
        this.setting.bannerUrl = bannerUrl
    }

    async computeDerivedData() {
        const posts = await getPlansBy('authorId', this.id, 'post')
        this.postCount = posts.length
        this.upVotes = posts.reduce((acc, post) => acc + post.upVote, 0)
    }
}