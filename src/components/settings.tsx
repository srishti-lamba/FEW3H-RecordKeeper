import {useState, useEffect} from 'react';
import { DifficultyButtons } from './settings-difficulty';
import { ChapterSelection, RouteChapters } from './settings-chapters';

interface SettingsProps {
  allChapters : RouteChapters[];
  difficulty : number;
  setDifficulty : any;
}

export default function Settings({allChapters, difficulty, setDifficulty} : SettingsProps) {

  const [show, setShow] = useState<boolean>(false);

  // Chapters: Scarlet Blaze
  const [sbStart, setSbStart] = useState<number>(2);
  const [sbEnd, setSbEnd] = useState<number>(2);

  const handleClick_settings = ( () => {
    console.log("Button clicked!")
    setShow(!show)
  })

  const handleClick_overlay = ( () => {
    console.log("Overlay clicked!")
    setShow(false)
  })

  // Run once
  useEffect(() => {
    console.log("Show:" + show)
  }, [])

  useEffect(() => {
    console.log("Show changed: " + show)
  }, [show])

  return (
    <div className="settings">
      
      <button
        title="Settings" 
        onClick={handleClick_settings} 
      />

      {
        show && (
          <>
            <div 
              className="overlay"
              onClick={handleClick_overlay}
            />
            <div className="popup">

              <h1>Settings</h1>
                <DifficultyButtons 
                    show={show} 
                    difficulty={difficulty} 
                    setDifficulty={setDifficulty} />
                <ChapterSelection
                    show={show}
                    // chapterStart={sbStart} setChapterStart={setSbStart}
                    // chapterEnd={sbEnd} setChapterEnd={setSbEnd}
                    allChapters={[allChapters[0], allChapters[1]]}/>
            </div>

            <svg height="0" width="0">
                <defs>
                    <clipPath id="three-diamonds"  clipPathUnits="objectBoundingBox" preserveAspectRatio="xMidYMid meet">
                        <path d="M 0 0.2595 L 0.1899 0.0696 L 0.3101 0.1899 L 0.5 0 L 0.6899 0.1899 L 0.8101 0.0696 L 1 0.2595 L 0.8101 0.4494 L 0.6899 0.3291 L 0.5 0.519 L 0.3101 0.3291 L 0.1899 0.4494 Z 
                        M 0.2279 0.386 L 0.2975 0.3164 L 0.2405 0.2595 L 0.2975 0.2025 L 0.2279 0.1329 L 0.1013 0.2595 Z 
                        M 0.3228 0.2025 L 0.3798 0.2595 L 0.3228 0.3164 L 0.5 0.4937 L 0.6772 0.3164 L 0.6203 0.2595 L 0.6772 0.2025 L 0.5 0.0254 L 0.3228 0.2025 Z 
                        M 0.7025 0.3164 L 0.7722 0.386 L 0.8987 0.2595 L 0.7722 0.1329 L 0.7025 0.2025 L 0.7595 0.2595 L 0.7025 0.3164 Z" />
                    </clipPath>
                </defs>
            </svg>

          </>
        )
      }
     
    </div>
  );
}