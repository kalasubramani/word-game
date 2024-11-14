import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
// import dictionaryWords from 'word-list'

function App() {
  const [count, setCount] = useState(0);
  const [input,setInput]=useState("");
  const [output,setOutput] = useState([]);

  const onTextChange = (e)=>{
    console.log(e.target.value);
    setInput(e.target.value);
  }

  const getAnagrams =()=>{
    let anagrams = allAnagrams(input);
    console.log(anagrams);    
    setOutput(anagrams)
  }

  const getSubstrings=()=>{
    let substrings = allSubstring(input);
    console.log(substrings)
    setOutput(substrings);
  }

  const renderOutput=
    output.map((val)=>{
      return(
          <li key={val} style={{listStyleType:'none'}}>{val}</li>
      )
    })
  

  const checkValidWord=()=>{
    let validWords=[];
    const validateWord= async ()=>{
      const results = output.map(async (word)=>{
            //call api
            let isValid = await isValidDictionaryWord(word);
            if(isValid) validWords.push(word);
      })  
      await Promise.all(results);     
    }

    //wait until all promises get resolved. then set the list of validwords to state
    validateWord().then(()=>{
      setOutput(validWords);
    });      
   
  }

  function allAnagrams(str) {
    //define a set to hold results - elimates duplicates at insertion
    //iterate thru chars in string
    //get char at 1 + letters before i + letter after i
    //push all combinations of anagrams to anagramSet
  
    //if end of string is reached, rotate the string to right by 1 
    //incr rotation by 1
  
    //if rotations >= string length
    //break
    //else continue
  
    //return anagramSet
  
    let anagramSet = new Set(), rotate = 0, length = str.length;
  
    while (rotate < length) {
      getAllAnagrams(str, anagramSet, length);
      //rotate string to right by 1
      let roateright = str.slice(1).concat(str.slice(0, 1));
      str = roateright;
      rotate++;
    }
  
    return [...anagramSet];
  }
  
  function getAllAnagrams(str, anagramSet, n) {
    for (let i = 0; i < n; i++) {
      //get char at i + letters before i + letter after i
      anagramSet.add(str.slice(i, i + 1).concat(str.slice(0, i)).concat(str.slice(i + 1)));
    }
  }

  function allSubstring(str) {
    //if str len is 0, return
    //if str len is 1, return 
    
    //function - findAllSubstrings(str)
       //params - str, setObj, length 
      //returns all substrings for a given string
      //input string is sliced to get substrings
      //if substr length >1, add to the set
      //return set
  
   
    //rotate input string n-1 times 
      //pass rotated string to  findAllSubstrings()
      //get all substrings in a set to eliminate duplicates
      //pass reversed str too findAllSubstrings()
      //new substrings are added to the set
       
    //return set
  
    const n = str.length;
    if (n === 0) return;
    if (n === 1) return;
  
    let substrings = new Set(), rotate = 0, temp;
   
    while (rotate < n) {
       getAllSubstrings(str, substrings, n);
   
      let rev = str.split('').reverse().join('');
       getAllSubstrings(rev, substrings, n);
     
      //rotate string to right by 1
      let roateright = str.slice(1).concat(str.slice(0, 1));
      str = roateright;
      rotate++;
    }
  
  
    return [...substrings];
  }
  
  function getAllSubstrings(str, substrings, n) {
    for (let i = 0; i < n; i++) {
      for (let j = 1; j <= n; j++) {
        let substr = str.slice(i, j);
        if(substr.length>1) substrings.add(substr)
      }
    }
    return substrings;
  }
  

  async function isValidDictionaryWord(word) {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`;
  
    try {
      const response = await fetch(apiUrl);
      if (response.ok) return true; // Word exists in the dictionary
      else return false; // Word does not exist in the dictionary      
    } catch (error) {
      console.error('Error fetching dictionary data:', error);
      return false; // Network or API error
    }
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
         <label> Enter your text: <input id="input" value={input} onChange={onTextChange}></input></label>
         <div style={{display:'flex', flexDirection:'row'}}>
          <div style={{width:'200px'}}><input type='radio' id="anagrams" value="anagrams" name='constraints' onChange={getAnagrams}/>Anagrams</div>
          <div style={{width:'200px'}}> <input type='radio' id="substrings" value="substrings" name='constraints' onChange={getSubstrings}/>Substrings</div>
          <div style={{width:'200px'}}> <input type='checkbox' id="dictWord" value="dictWord" name='' onChange={checkValidWord}/>Valid Dictionary Words</div>
         </div>
         <ul id="output" >{renderOutput}</ul>
        
        {/* <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p> */}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
