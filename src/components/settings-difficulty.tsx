import {useEffect, useRef} from 'react';

interface DifficultyButtonsProps {
  show: boolean;
  difficulty: number;
  setDifficulty: any;
}

export const DifficultyButtons = ({show, difficulty, setDifficulty} : DifficultyButtonsProps) => {

    const btnEasy = useRef(null);
    const btnNorm = useRef(null);
    const btnHard = useRef(null);
    const btnMadd = useRef(null);

    const handleClick_difficulty = ( (btn : any) => {
        // console.log("Difficulty clicked!")
        setDifficulty(Number(btn.current.value));
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
            case 0: btn = btnEasy; break;
            case 1: btn = btnNorm; break;
            case 2: btn = btnHard; break;
            case 3: btn = btnMadd; break;
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
                        value={0}
                        className={difficulty==0 ? "active" : ""}
                        onClick={() => handleClick_difficulty(btnEasy)} >
                        Easy
                    </button>
                    <button 
                        ref={btnNorm}
                        value={1}
                        className={difficulty==1 ? "active" : ""}
                        onClick={() => handleClick_difficulty(btnNorm)} >
                        Normal
                    </button>
                    <button 
                        ref={btnHard} 
                        value={2}
                        className={difficulty==2 ? "active" : ""}
                        onClick={() => handleClick_difficulty(btnHard)} >
                        Hard
                    </button>
                    <button 
                        ref={btnMadd} 
                        value={3}
                        className={difficulty==3 ? "active" : ""}
                        onClick={() => handleClick_difficulty(btnMadd)} >
                        Maddening
                    </button>
                </span>
            </span>
        </>
    )
}