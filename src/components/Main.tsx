import { useState, useEffect, useRef } from "react"

export default function Main() {
    const [meme, setMeme] = useState({
        topText: "One does not simply",
        bottomText: "Walk into Mordor",
        imageUrl: "http://i.imgflip.com/1bij.jpg"
    })
    const [allMemes, setAllMemes] = useState([])
    const canvasRef = useRef(null)

    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes")
            .then(res => res.json())
            .then(data => setAllMemes(data.data.memes))
    }, [])
    
    function getMemeImage() {
        const randomNumber = Math.floor(Math.random() * allMemes.length)
        const newMemeUrl = allMemes[randomNumber].url
        setMeme(prevMeme => ({
            ...prevMeme,
            imageUrl: newMemeUrl
        }))
    }

    function handleChange(event) {
        const {value, name} = event.currentTarget
        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }))
    }
    
function drawStyledText(ctx, text, x, y) {
    ctx.font = "bold 60px Impact";
    ctx.textBaseline = "middle";

    text = text.toUpperCase();

    const letters = text.split("");
    const letterSpacing = 3;

    // --- Accurate total text width ---
    let totalWidth = 0;
    letters.forEach((letter, i) => {
        totalWidth += ctx.measureText(letter).width;
        if (i < letters.length - 1) totalWidth += letterSpacing;
    });

    let startX = x - totalWidth / 2;

    const shadowOffsets = [
        [2, 2], [-2, -2], [2, -2], [-2, 2],
        [0, 2], [2, 0], [0, -2], [-2, 0]
    ];

    letters.forEach(letter => {
        const w = ctx.measureText(letter).width;

        // Draw shadows
        shadowOffsets.forEach(([sx, sy]) => {
            ctx.fillStyle = "black";
            ctx.fillText(letter, startX + sx, y + sy);
        });

        // Draw main white text
        ctx.fillStyle = "white";
        ctx.fillText(letter, startX, y);

        startX += w + letterSpacing;
    });
}


    async function generateCanvasMeme() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Wait for Google Font to load
    await document.fonts.load("40px Karla")

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = meme.imageUrl

    img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height

        ctx.drawImage(img, 0, 0)

        drawStyledText(ctx, meme.topText, canvas.width / 2, 80)
        drawStyledText(ctx, meme.bottomText, canvas.width / 2, canvas.height - 80)
    }
}


    function downloadMeme() {
        generateCanvasMeme()

        setTimeout(() => {
            const canvas = canvasRef.current
            const link = document.createElement("a")
            link.download = "meme.png"
            link.href = canvas.toDataURL("image/png")
            link.click()
        }, 200)
    }

    return (
        <main>
            <div className="form">
                <label>Top Text
                    <input
                        type="text"
                        placeholder="One does not simply"
                        name="topText"
                        onChange={handleChange}
                        value={meme.topText}
                    />
                </label>

                <label>Bottom Text
                    <input
                        type="text"
                        placeholder="Walk into Mordor"
                        name="bottomText"
                        onChange={handleChange}
                        value={meme.bottomText}
                    />
                </label>
                
                <button onClick={getMemeImage}>Get a new meme image 🖼</button>
                <button onClick={downloadMeme}>Download Meme ⬇️</button>
            </div>

            <div className="meme">
                <img src={meme.imageUrl} />
                <span className="top">{meme.topText}</span>
                <span className="bottom">{meme.bottomText}</span>
            </div>

            <canvas ref={canvasRef} style={{ display: "none" }} />
        </main>
    )
}
