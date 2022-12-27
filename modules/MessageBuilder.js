export default class MessageBuilder {
    constructor(type = null, content = null) {
        this.type = type
        this.content = content
    }

    build() {
        return {type: this.type, content: this.content}
    }

    setType(type) {
        this.type = type
        return this
    }

    setContent(content) {
        this.content = content
        return this
    }
}