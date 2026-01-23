import React, {useEffect, useState, useRef} from 'react';
import Select, {Props, GroupBase} from 'react-select';

export interface Chapter {
  number: number;
  name: string;
  part: number;
  byleth: number;
  final: boolean;
}

export interface RouteChapters {
  id: number;
  route: string;
  chapters: Chapter[];
}

interface SelectOption {
  value: string;
  label: string;
  disabled: boolean;
}

interface ChapterSelectionProps {
  show: boolean;
  // chapterStart: number;
  // setChapterStart: any;
  // chapterEnd: number;
  // setChapterEnd: any;
  allChapters: RouteChapters[];
}

export function ChapterSelection({show, /*chapterStart, setChapterStart, chapterEnd, setChapterEnd,*/ allChapters} : ChapterSelectionProps) {

  // const [selectOptions, setChapterOptions] = useState<SelectOption[]>([]);

  // const selectStart = useRef(null);

  // const btnStartUp = useRef(null);
  // const btnStartDown = useRef(null);
  // const btnEndUp = useRef(null);
  // const btnEndDown = useRef(null);

  // const handleClick_select = ( (event : MouseEvent) => {
  //   console.log("Select start clicked!");
    
  // })

  // const handleClick_startUp = ( (btn : any) => {
  //   console.log("Start Up clicked!")
  //   setChapterStart(btn.current.value);
  // })

  function createSelectOptions() : SelectOption[] {
    console.log("Starting createSelectOptions")
    let options : SelectOption[] = [];
    let pCh : number = 0;
    let rCh : number = 0;
    let pChs : Chapter[] = allChapters[0].chapters;
    let rChs : Chapter[] = allChapters[1].chapters;
    let routeID : number = allChapters[1].id;
    let prologueLblPlaced : boolean = false;
    let partOneLblPlaced : boolean = false;
    let partTwoLblPlaced : boolean = false;
    let recruitedLblPlaced : boolean = false;
    let indent = "   ";
    // let lastPCh : number = pChs.findLast
    // Prologue
    if (pCh < pChs.length) {
      let curCh = pChs[pCh]

      // All : Prologue
      while ((pCh < pChs.length) && (curCh.part == 0)) {
        if (!prologueLblPlaced) {
          options.push({value:"Prologue", label:"Prologue:", disabled:true})
          prologueLblPlaced = true;
        }

        options.push({value:"0-"+pCh, label:curCh.name, disabled:false})

        pCh += 1;
        curCh = pChs[pCh]
      }

      // Route : Prologue and Part 1 and 2: Before split
      curCh = rChs[rCh]
      while ((rCh < rChs.length) && (curCh.byleth == -1)) {
        if (!partOneLblPlaced && curCh.part == 1) {
          options.push({value:"PartOne", label:"Part One:", disabled:true})
          partOneLblPlaced = true;
        }
        else if (!partTwoLblPlaced && curCh.part == 2) {
          options.push({value:"PartTwo", label:"Part Two:", disabled:true})
          partTwoLblPlaced = true;
        }

        options.push({value:routeID+"-"+rCh, label:curCh.name, disabled:false})

        rCh += 1;
        curCh = rChs[rCh]
      }

      // Route : No Byleth
      if (curCh.byleth == 0) {
        options.push({value:"NoByleth", label:"Not recruited:", disabled:true})

        while ((rCh < rChs.length) && (curCh.byleth == 0)) {
          options.push({value:routeID+"-"+rCh, label:indent+curCh.name, disabled:false})

          rCh += 1;
          curCh = rChs[rCh]
        }
      }

      // Route : Yes Byleth
      if (curCh.byleth == 1) {
        options.push({value:"YesByleth", label:"Recruited:", disabled:true})
        recruitedLblPlaced = true;

        while ((rCh < rChs.length) && (curCh.byleth == 1)) {
          options.push({value:routeID+"-"+rCh, label:indent+curCh.name, disabled:false})

          rCh += 1;
          curCh = rChs[rCh]
        }
      }

      // All : Yes Byleth
      curCh = pChs[pCh]
      if (curCh.byleth == 1) {
        if (!recruitedLblPlaced) {
          options.push({value:"YesByleth", label:"Recruited:", disabled:true})
          recruitedLblPlaced = true;
        }

        while ((pCh < pChs.length) && (curCh.byleth == 1)) {
          options.push({value:"0-"+pCh, label:indent+curCh.name, disabled:false})

          pCh += 1;
          curCh = pChs[pCh]
        }
      }

      // Route : Final Chapter
      curCh = rChs[rCh]
      options.push({value:routeID+"-"+rCh, label:curCh.name, disabled:false})
      
    }

    console.log("Options:")
    console.log(options);
    return options;
  }

  // ------------------------
  // --- Helper Functions ---
  // ------------------------

  // Run once
  useEffect(() => {
    console.log("Passed Chapters:")
    console.log(allChapters)
  }, [])

//   function CustomSelect<
//     Option,
//     IsMulti extends boolean = false,
//     Group extends GroupBase<Option> = GroupBase<Option>
//   >(props: Props<Option, IsMulti, Group>) {
//     return (
//       <Select {...props} theme={(theme) => ({ ...theme, borderRadius: 0 })} />
//     );
//   }

  const customSelectProps = {
    Option: {createSelectOptions}
  }

  // useEffect(() => {

  //     console.log("Difficulty changed: " + difficulty)

  //     if (btnEasy.current == null) {
  //         return
  //     }

  //     let arr : any[] = [btnEasy, btnNorm, btnHard, btnMadd]
  //     arr.map( (b) => {(b.current as HTMLButtonElement).classList.remove("active");})

  //     let btn : any = null;
  //     switch (difficulty) {
  //         case "easy":      btn = btnEasy; break;
  //         case "normal":    btn = btnNorm; break;
  //         case "hard":      btn = btnHard; break;
  //         case "maddening": btn = btnMadd; break;
  //     }
  //     (btn.current as HTMLButtonElement).classList.add("active");

  // }, [difficulty])

  if (!show) {
    return <></>;
  }

  return (
    <>
      <span className="section route-section">
        <span className="prompt">{allChapters[1].route}</span>
        *<Select 
          // className="chapter-select" 
          // ref={selectStart} 
          // Option={createSelectOptions()}
          // {...customSelectProps}
          options= {createSelectOptions()}
         />
         

      </span>
    </>
  )
}