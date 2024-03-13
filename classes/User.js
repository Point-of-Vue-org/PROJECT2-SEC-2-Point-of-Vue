export class User {
    constructor(userData) {
        this.id = userData?.id || undefined
        this.username = userData?.username || ''
        this.email = userData?.email || ''
        this.password = userData?.password || ''
        this.setting = {
            avatarUrl: userData?.avatarUrl || '',
            bannerUrl: userData?.bannerUrl || ''
        }
    }

    setAvatar(avatarUrl) {
        this.setting.avatarUrl = avatarUrl
    }
}