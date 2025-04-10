package dmitrykovalev.guitarbeat

interface Platform {
    val name: String
}

expect fun getPlatform(): Platform