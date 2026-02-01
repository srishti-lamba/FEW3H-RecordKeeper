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
  prefix?: string;
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

  const [allOptions, setAllOptions] = useState<OptionsOrGroups<SelectOption, GroupedOption>>([]);
  const [selectedOption, setSelectedOption] = useState<SelectOption>();

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
          else {
            finalChapterOption.push({value:[routeID,rCh], chapter:curCh.number, name:curCh.name})
          }
        }
        // Not Recruited
        else if (curCh.byleth == 0) {
          notRecruitedOptions.push({value:[routeID,rCh], chapter:curCh.number, name:curCh.name, prefix:"└"})
        }
        // Recruited
        else if (curCh.byleth == 1) {
          recruitedOptions.push({value:[routeID,rCh], chapter:curCh.number, name:curCh.name, prefix:"├"})
        }
        rCh += 1;
        curCh = rChs[rCh]
      }

      // Route : Part 2: Recruited-Only chapters
      curCh = pChs[pCh]
      while ((pCh < pChs.length) && (curCh.part == 2) && (curCh.byleth == 1)) {
        recruitedOptions.push({value:[routeID,rCh], chapter:curCh.number, name:curCh.name, prefix:"├"})
        pCh += 1;
        curCh = pChs[pCh]
      }
      recruitedOptions[recruitedOptions.length-1].prefix = "└"

    }

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

  }

  // ------------------------
  // --- Helper Functions ---
  // ------------------------

  const handleChange_select = (event: any) => {
    setSelectedOption(event);
    console.log(event);
  }

  // Run once
  useEffect(() => {
    createSelectOptions();
  }, [])

  if (!show) {
    return <></>;
  }

  return (
    <>
      <span className="section chapter-selection">
        <span className="prompt">{allChapters[1].route}</span>
        <span className="chapter-selection-wrapper">
          <span className="chapter-selection-arrow-wrapper">
            <img 
              className="chapter-selection-up-arrow"
              src={process.env.PUBLIC_URL + "/images/ui-icons/down-arrow.png"}
            />
          </span>
          <Select 
            className="chapter-selection-dropdown"
            options = {allOptions}
            isClearable = {false}
            onChange={handleChange_select}
            value={selectedOption}
            // menuIsOpen={true}
            formatOptionLabel={(opt : unknown, { context }) => {
              let option : SelectOption = (opt as SelectOption)
              if (option.chapter == -1)
                return context === "menu" ? "Final chapter" : "Final";
              else if (option.prefix != undefined)
                return context === "menu" ? option.prefix + " Chapter " + option.chapter : option.chapter;
              else
                return context === "menu" ? "Chapter " + option.chapter : option.chapter;
              }
            }
          />
          <span className="chapter-selection-arrow-wrapper">
            <img 
              className="chapter-selection-down-arrow"
              src={process.env.PUBLIC_URL + "/images/ui-icons/down-arrow.png"}
            />
          </span>
         
          </span>
      </span>
      <svg height="0" width="0">
        <defs>
            <clipPath id="down-arrow-clip"  clipPathUnits="objectBoundingBox" preserveAspectRatio="xMidYMid meet">
              <path d="M 0.025 0.075 L 0.475 0.575 
              Q 0.5 0.6 0.525 0.575 L 0.975 0.075 
              Q 1.01 0.02 0.95 0.025 L 0.525 0.1125 
              Q 0.5 0.1175 0.475 0.1125 L 0.05 0.025 
              Q -0.01 0.02 0.025 0.075"/>
            </clipPath>
        </defs>
      </svg>
    </>
  )
}