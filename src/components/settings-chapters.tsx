import React, {useEffect, useState, useRef} from 'react';
import Select, {Props, GroupBase, OptionsOrGroups, StylesConfig } from 'react-select';

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
  value: number[];
  chapter: number;
  name: string;
}

interface PrologueOption extends SelectOption {};
interface PartOneOption extends SelectOption {};
interface PartTwoOption extends SelectOption {};
interface NotRecruitedOption extends SelectOption {};
interface RecruitedOption extends SelectOption{};

interface GroupedOption extends GroupBase<SelectOption> {
  readonly label?: string,
  readonly options: PrologueOption[] | PartOneOption[] | PartTwoOption[] | NotRecruitedOption[] | RecruitedOption[]
}
// interface GroupedOption extends GroupBase<PrologueOption[] | PartOneOption[] | PartTwoOption[] | NotRecruitedOption[] | RecruitedOption[]> {
//   label?: string,
//   options: PrologueOption[] | PartOneOption[] | PartTwoOption[] | NotRecruitedOption[] | RecruitedOption[]
// }
interface PartTwoOptionGroup extends GroupBase<NotRecruitedOption | RecruitedOption | PartTwoOption> {
  label?: string,
  options: Array<NotRecruitedOption | RecruitedOption | PartTwoOption>
};

interface ChapterSelectionProps {
  show: boolean;
  // chapterStart: number;
  // setChapterStart: any;
  // chapterEnd: number;
  // setChapterEnd: any;
  allChapters: RouteChapters[];
}

export function ChapterSelection({show, /*chapterStart, setChapterStart, chapterEnd, setChapterEnd,*/ allChapters} : ChapterSelectionProps) {

  // const [allOptions, setAllOptions] = useState<GroupedOption[]>([])
  // const [selectedOption, setSelectedOption] = useState<ValueType<SelectOption>>([]);
  // const allOptions : GroupedOption[] = [];
  const [allOptions, setAllOptions] = useState<OptionsOrGroups<SelectOption, GroupedOption>>([]);
  const [selectedOption, setSelectedOption] = useState<SelectOption>();

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

  function createSelectOptions() {
    console.log("Starting Chapter createSelectOptions")
    // let options : SelectOption[] = [];
    let pCh : number = 0;
    let rCh : number = 0;
    let pChs : Chapter[] = allChapters[0].chapters;
    let rChs : Chapter[] = allChapters[1].chapters;
    let routeID : number = allChapters[1].id;
    let prologueOptions : PrologueOption[] = [];
    let partOneOptions : PartOneOption[] = [];
    let partTwoOptions : PartTwoOption[] = [];
    let notRecruitedOptions : NotRecruitedOption[] = [];
    let recruitedOptions : RecruitedOption[] = [];
    // let finalChapterOption : PartTwoOption = {id:[],chapter:0,name:""};
    const finalChapterOption : PartTwoOption[] = [];

    // Prologue
    if (pCh < pChs.length) {

      // All : Prologue
      let curCh = pChs[pCh]
      while ((pCh < pChs.length) && (curCh.part == 0)) {
        prologueOptions.push({value:[0,pCh], chapter:curCh.number, name:curCh.name})
        pCh += 1;
        curCh = pChs[pCh]
      }

      // Route : Prologue
      curCh = rChs[rCh]
      while ((rCh < rChs.length) && (curCh.part == 0)) {
        prologueOptions.push({value:[routeID,rCh], chapter:curCh.number, name:curCh.name})
        rCh += 1;
        curCh = rChs[rCh]
      }

      // Route : Part 1
      while ((rCh < rChs.length) && (curCh.part == 1)) {
        partOneOptions.push({value:[routeID,rCh], chapter:curCh.number, name:curCh.name})
        rCh += 1;
        curCh = rChs[rCh]
      }

      // Route : Part 2: Before split
      while ((rCh < rChs.length) && (curCh.part == 2)) {
        // Shared
        if (curCh.byleth == -1) {
          // Shared: Before split
          if (curCh.number != -1) {
            partTwoOptions.push({value:[routeID,rCh], chapter:curCh.number, name:curCh.name})
          }
          // Shared: After split
          // else {
          //   finalChapterOption.id = [routeID,rCh];
          //   finalChapterOption.chapter = curCh.number;
          // }
          else {
            finalChapterOption.push({value:[routeID,rCh], chapter:curCh.number, name:curCh.name})
          }
        }
        // Not Recruited
        else if (curCh.byleth == 0) {
          notRecruitedOptions.push({value:[routeID,rCh], chapter:curCh.number, name:curCh.name})
        }
        // Recruited
        else if (curCh.byleth == 1) {
          recruitedOptions.push({value:[routeID,rCh], chapter:curCh.number, name:curCh.name})
        }
        rCh += 1;
        curCh = rChs[rCh]
      }
    }

  //   const partTwoOptionsGroup = [
  //   {
  //     options: partTwoOptions
  //   },
  //   {
  //     label: "Not Recruited",
  //     options: notRecruitedOptions
  //   },
  //   {
  //     label: "Recruited",
  //     options: recruitedOptions
  //   },
  //   {
  //     options: finalChapterOption
  //   }
  // ]

  // const groupedOptions = [
  //   {
  //     label: "Prologue",
  //     options: prologueOptions
  //   },
  //   {
  //     label : "Part One",
  //     options: partOneOptions
  //   },
  //   {
  //     label: "Part Two",
  //     options: partTwoOptionsGroup
  //   }
  // ]

  let groupedOptions : GroupedOption[] = [
    {
      label: "Prologue",
      options: prologueOptions
    },
    {
      label : "Part One",
      options: partOneOptions
    },
    {
      label : "Part Two",
      options: partTwoOptions
    },
    {
      label: "Not Recruited",
      options: notRecruitedOptions
    },
    {
      label: "Recruited",
      options: recruitedOptions
    },
    {
      options: finalChapterOption
    }
  ]

    console.log("Chapter Select Options:")
    console.log(groupedOptions);
    setAllOptions(groupedOptions);
    setSelectedOption(groupedOptions[0].options[0])
    // allOptions = groupedOptions;
    // groupedOptions.forEach(x=>allOptions.push(x))
    // allOptions.push()
    // return groupedOptions;
  }

  // ------------------------
  // --- Helper Functions ---
  // ------------------------

  const handleChange_select = (event: any) => {
    setSelectedOption(event);
    console.log(event);
  }

  // const colourStyles : StylesConfig = {
  //   control: (styles: any) => ({ ...styles, backgroundColor: 'white' }),
  //   option: (styles: any, { data, isDisabled, isFocused, isSelected }: any) => {
  //     // const color = chroma(data.color);
  //     return {
  //       ...styles,
  //       backgroundColor: isSelected ? 'red' : 'blue',
  //       color: '#FFF',
  //       cursor: isDisabled ? 'not-allowed' : 'default',
  //     };
  //   }
  // };

  // Run once
  useEffect(() => {
    createSelectOptions();
  }, [])

  // createSelectOptions();

//   function CustomSelect<
//     Option,
//     IsMulti extends boolean = false,
//     Group extends GroupBase<Option> = GroupBase<Option>
//   >(props: Props<Option, IsMulti, Group>) {
//     return (
//       <Select {...props} theme={(theme) => ({ ...theme, borderRadius: 0 })} />
//     );
//   }

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

  // ---------------------
  // --- Type Checking ---
  // ---------------------

  function isSelectOption(object: any): object is SelectOption {
    return 'id' in object;
}

  if (!show) {
    return <></>;
  }

  return (
    <>
      <span className="section chapter-selection">
        <span className="prompt">{allChapters[1].route}</span>
        <span className="chapter-selection-wrapper">
          <img 
            className="chapter-selection-up-arrow"
            src={process.env.PUBLIC_URL + "/images/ui-icons/down-arrow.png"}
          />
          <Select 
            className="chapter-selection-dropdown"
            // ref={selectStart} 
            // Option={createSelectOptions()}
            // {...customSelectProps}
            // options = {createSelectOptions()}
            options = {allOptions}
            isClearable = {false}
            onChange={handleChange_select}
            value={selectedOption}
              // allOptions.filter((option) => 
              // option.options[] === 'Some label')
            // menuIsOpen={true}
            formatOptionLabel={(opt : unknown, { context }) => {
              let option : SelectOption = (opt as SelectOption)
              if (option.chapter == -1)
                return context === "menu" ? "Final chapter" : "Final";
              else if (option.value[0] == 1 && (option.value[1] == 11 || option.value[1] == 12))
                return context === "menu" ? "└ Chapter " + option.chapter : option.chapter;
              else
                return context === "menu" ? "Chapter " + option.chapter : option.chapter;
              }
            }
            // styles={colourStyles}
            // styles={{
            //   control: (baseStyles, state) => ({
            //     ...baseStyles,
            //     borderColor: state.isSelected ? 'grey' : 'red',
            //   }),
            //   options: ()
            // }}
          />
          <img 
            className="chapter-selection-down-arrow"
            src={process.env.PUBLIC_URL + "/images/ui-icons/down-arrow.png"}
          />
         
          </span>
      </span>
    </>
  )
}