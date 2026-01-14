import {useEffect, useRef} from 'react';

interface DifficultyButtonsProps {
  show: boolean;
  difficulty: string;
  setDifficulty: any;
}

export const DifficultyButtons = ({show, difficulty, setDifficulty} : DifficultyButtonsProps) => {

    const btnEasy = useRef(null);
    const btnNorm = useRef(null);
    const btnHard = useRef(null);
    const btnMadd = useRef(null);

    const handleClick_difficulty = ( (btn : any) => {
        console.log("Difficulty clicked!")
        setDifficulty(btn.current.value);
    })

    // Run once
    useEffect(() => {
    }, [])

    useEffect(() => {

        console.log("Difficulty changed: " + difficulty)

        if (btnEasy.current == null) {
            return
        }

        let arr : any[] = [btnEasy, btnNorm, btnHard, btnMadd]
        arr.map( (b) => {(b.current as HTMLButtonElement).classList.remove("active");})

        let btn : any = null;
        switch (difficulty) {
            case "easy":      btn = btnEasy; break;
            case "normal":    btn = btnNorm; break;
            case "hard":      btn = btnHard; break;
            case "maddening": btn = btnMadd; break;
        }
        (btn.current as HTMLButtonElement).classList.add("active");

    }, [difficulty])

    if (!show) {
        return <></>;
    }

    return (
        <>
            <span className="section">
                <span className="prompt">Difficulty</span>
                <span className="buttons">
                    <button 
                        ref={btnEasy} 
                        value="easy"
                        className={difficulty==="easy" ? "active" : ""}
                        onClick={() => handleClick_difficulty(btnEasy)} >
                        Easy
                    </button>
                    <button 
                        ref={btnNorm}
                        value="normal"
                        className={difficulty==="normal" ? "active" : ""}
                        onClick={() => handleClick_difficulty(btnNorm)} >
                        Normal
                    </button>
                    <button 
                        ref={btnHard} 
                        value="hard"
                        className={difficulty==="hard" ? "active" : ""}
                        onClick={() => handleClick_difficulty(btnHard)} >
                        Hard
                    </button>
                    <button 
                        ref={btnMadd} 
                        value="maddening"
                        className={difficulty==="maddening" ? "active" : ""}
                        onClick={() => handleClick_difficulty(btnMadd)} >
                        Maddening
                    </button>
                </span>
            </span>
        </>
    )
}