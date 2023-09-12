import './App.css';
//import './style.css';
import React, { useState, useEffect } from 'react';
import OpenAI from 'openai';


//import toast, { Toaster } from "react-hot-toast";

// ICONS
import {FaCloudDownloadAlt} from "react-icons/fa"
import {FaFileDownload} from "react-icons/fa"

import {FaComment} from "react-icons/fa"
import {FaMarker} from "react-icons/fa6"

import {FaRegImage} from "react-icons/fa6"

import { IconContext } from 'react-icons/lib';



const openai = new OpenAI({ 
  apiKey: "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",
  dangerouslyAllowBrowser: true 
});


function App(){
  const [loading, setLoading] = useState(false);
  const [inputWords, setInputWords] = useState("");
  const [isSentenceButtonChecked, setIsSentenceButtonChecked] = useState(true);
  const [resultText, setResultText] = useState("");
  const [mnemonicText, setMnemonicText] = useState("");
  const [longUrl, setLongUrl] = useState('');
  const [buttonClicked, setbuttonClicked] = useState(false);
  const [sentence, setsentence] = useState(false);

/*
 // Sa
  useEffect(() => {
    document.addEventListener("contextmenu",handlecontextmenu)
    return()=>{
      document.removeEventListener("contextmenu",handlecontextmenu)
    }
  },[])

  const handlecontextmenu=(e)=>{
    e.preventDefault()
    alert("right clikc is disabeled")
    toast.error("right clikc is disabeled since this website is still development")
  }
  */

//************************************** */
  const regenerateImage = async () => {
    try {
      setLoading(true);
      let canvas=document.getElementById("imageCanvas");
      let ctx = canvas.getContext('2d');

      let data=document.getElementById("CreatedMnemonic").innerHTML;

      console.log("data: " + data);
      console.log("data_2: " + data.split('"')[1]);
      
      const response = await openai.images.generate({
        prompt: data.split('"')[1]+" ,with white background",
        n: 1,
        size: "512x512",
      })
      let source=response.data[0].url;
      console.log("source: " + source);
     // source = source.replace("https://oaidalleapiprodscus.blob.core.windows.net/", "api/");
     // console.log("NEW_source: " + source);

    //  document.getElementById("regenerateImage").innerHTML = source;

      let newImage = new Image();
      newImage.src = source;
      newImage.onload = function() {
        ctx.drawImage(newImage, 505, 5,400,400); // (x, y) coordinates for the top-left corner of the image
        while(true){
          if(newImage.complete){
            setLoading(false);
          }
          break;
        }
      };
      setLongUrl(source.replace("https://oaidalleapiprodscus.blob.core.windows.net/", "api/"))
      setbuttonClicked(true)
     // return buttonClicked = true
    }catch(error){
      console.error(error);
      setLoading(false);
    } 
  }
  //************************************** */
  const createMnemonic = async () => {
    try {
      setLoading(true);
      // Loading... yazısının ekranda görünür hale getirilmesi

      // Canvas ögesi
      let canvas=document.getElementById("imageCanvas");
      let ctx = canvas.getContext('2d');
      // words: Textareaya yazılan değer
      let words=document.getElementById("textarea").value;

      // button1= Sentence butonu seçilmişse değeri true olan bir değişken
      // button2= Word butonu seçilmişse değeri true olan bir değişken
      let button1=document.getElementById("sentence_button").checked;
      let button2=document.getElementById("word_button").checked;
      // prompt: chatgpt-ye verilecek olan komut. 
      let prompt;
      //console.log(words);
      // Eğer sentence butonu seçiliyse aşağıdaki promptu, değilse diğer promptu chatgpt ye verir.
      
      // seven risk factors of long cancer 
      if(button1){
        setsentence(true)
        prompt=`Can you create a funny, catchy and meaningful mnemonic phrase with this phrase "${words}"?`;
        async function create() {
          try {
            const chatCompletion =  await openai.chat.completions.create({
              model: "gpt-3.5-turbo-0301",
              messages: [{"role": "user", "content": prompt}],
              max_tokens: 300,
            });
            console.log(chatCompletion.choices[0]);
            console.log(chatCompletion.choices[0].message); // eypiay  (API)
            console.log(chatCompletion.choices[0].message.content);
  
            const responseData = chatCompletion.choices[0].message.content;

            const text_1 = responseData;
            console.log("text_1: " + text_1);
            
            // Gelen cevabı daha rahat bölmek için kullanılan # işaretinin cevapan kaldırılması
            document.getElementById("CreatedMnemonic").innerHTML = text_1;

  
            const response = await openai.images.generate({
              prompt: responseData + " ,with white background",
              n: 1,
              size: "512x512",
            });
  
            //*************************** */
            // source: dall-e den gelen resmin urlsi. 
            let source=response.data[0].url;
            console.log("source "+ source);
           // source = source.replace("https://oaidalleapiprodscus.blob.core.windows.net/", "api/");
           // console.log("NEW_source: " + source);
            setLongUrl(source.replace("https://oaidalleapiprodscus.blob.core.windows.net/", "api/"))
  
            //  document.getElementById("A").innerHTML = source;
            // Canvas (Tuval) ögesinin resetlenmesi ve arka planın beyaz yapılması
            let newImage = new Image();
            newImage.src = source;
            newImage.onload = async function() {
              
             // Canvas'ı temizle
              ctx.clearRect(0, 0, canvas.width, canvas.height);


              // Metni sola ve resmi sağa yerleştir
              let fontSize = 40;
              let fontFamily = 'Arial';

             // Sol tarafta text1'i ve altına text2'yi yaz
              ctx.fillStyle = 'black'; // Metin rengi
              ctx.font = `${fontSize}px ${fontFamily}`;
              ctx.textAlign = 'left'; // Metin hizalama
              ctx.textBaseline = 'top'; // Metin taban hizalama

               // Metinlerin yazılacağı başlangıç koordinatları
              let x = 10;
              let y = 10;

              const maxLineWidth = canvas.width / 2 - 20; // Metinlerin maksimum genişliği

              function writeText(text) {
                const words = text.trim().split(' ');

                for (const word of words) {
                  const wordWidth = ctx.measureText(word).width;

                  if (x + wordWidth > maxLineWidth) {
                    // Kelimenin yazılması bu satıra sığmazsa alt satıra geç
                    x = 10;
                    y += fontSize + 20; // 20 piksel boşluk bırak
                  }

                  ctx.fillText(word, x, y);

                  // Kelimenin sonuna boşluk eklemeyi unutma
                  x += wordWidth + ctx.measureText(' ').width;
                }
              }

              writeText(text_1);


              // Resmi sağa yerleştir
              //ctx.drawImage(newImage, canvas.width / 2 + 5, 5, canvas.width / 2 - 10, canvas.height - 10);
              ctx.drawImage(newImage, 505, 5,400,400); 

            };
            // Create Mnemonic butonuna bastıktan sonra Download ve Regenerate butonlarının görünür olması. 
           // document.getElementById("regeneratebutton").style.visibility='visible';
            document.getElementById("regeneratebutton_img").style.visibility='visible';
            document.getElementById("textbutton").style.visibility='visible';
  
            setLoading(false);
            setLongUrl(source.replace("https://oaidalleapiprodscus.blob.core.windows.net/", "api/"))
          } catch(error){
            console.error("Error in create function", error);
            setLoading(false);
            
          }
        }
        create();
      }
      else if(button2){
          setsentence(false)
        // seven risk factors of long cancer
        prompt=`Create a reminder for ${words}. The output format should be exactly like "ABCD":A****#B*****#C*****#D****. Hashtags and quotes are really important. For example, if a number is written anywhere in the text as a letter or a number. You must find as many letters as the mathematical value of that number and combine these letters to form a meaningful sentence. If a meaningful sentence cannot be formed, you should continue to find other letters until a meaningful sentence is formed. The letters should be such that when combined, they form a meaningful word. If there is a number Six the output might look like this. It goes like this: "SUNSET": S- Smoking# U-Unhealthy diet# N - Not exercising# S - Sun exposure# E - Environmental toxins# T - Tobacco and alcohol use.`;
        async function create() {
          try {
            function convertNumericToText(expression) {
              // Sayısal ifadeyi yazısal ifadeye dönüştürün (örneğin, 7'i "seven" yapın)
              const numericToTextMap = {
                '4': 'four',
                '5': 'five',
                '6': 'six',
                '7': 'seven',
                '8': 'eight',
                '9': 'nine',
                '10': 'ten',
                // Diğer sayısal ifadeleri burada ekleyin
              };
            
              return numericToTextMap[expression] || expression;
            }
            
            // Metni alma
            var inputText = document.getElementById("textarea").value;
            console.log("inputText: " + inputText);

            function findNumericAndTextExpressions(text) { // four five six seven eight nine 
              var expressions = text.match(/(\(\d+\)|\b(four|five|six|seven|eight|nine|ten)\b|\b\d+\b)/g);

              console.log("expressions: " + expressions);
            
              if (expressions !== null) {
               // var textExpressions = expressions.map(convertNumericToText);
               // console.log("textExpressions: " + textExpressions);
                return expressions;
              } else {
                return [];
              }
            }
            
            var numbers = findNumericAndTextExpressions(inputText);
            console.log("Rakamsal ve Yazısal İfadeler: " + numbers);
            var numberstext = convertNumericToText(numbers[0]);
            console.log("numberstext: " + numberstext);
            
            const chatCompletion =  await openai.chat.completions.create({
              model: "gpt-3.5-turbo-0301",
              messages: [{"role": "user", "content": prompt}],
              max_tokens: 300,
            });
            console.log(chatCompletion.choices[0]);
            console.log(chatCompletion.choices[0].message); // eypiay  (API)
            console.log(chatCompletion.choices[0].message.content);
  
            var responseData = chatCompletion.choices[0].message.content;
            // Chatgpt den gelen cevabın parçalara ayrılması. Daha iyi anlamak için prompt stringini inceleyebilirsiniz.
            // Gelen cevabın parçalara ayrılması

            // BAŞ KISALTILMIŞ KELİMEYİ ALIYOR ""EAGLE""
            var deneme =responseData.split('"')[1];
            deneme = deneme.replace(/\s+/g, '');
            console.log("deneme: " + deneme);

            var harfSayisi = deneme.length;
            console.log("deneme içindeki harf sayısı: " + harfSayisi);
            // Harf sayısını yazısal ifadelerle eşleştirin
            var harfSayisiText = convertNumericToText(harfSayisi.toString());
            console.log("Harf Sayısı (Yazısal): " + harfSayisiText);
            

            while (harfSayisiText != numberstext){
              const New_chatCompletion =  await openai.chat.completions.create({
                model: "gpt-3.5-turbo-0301",
                messages: [{"role": "user", "content": prompt}],
                max_tokens: 300,
              });
              responseData = New_chatCompletion.choices[0].message.content;
              console.log("responseData: " + responseData);

              // BAŞ KISALTILMIŞ KELİMEYİ ALIYOR ""EAGLE""
              deneme =responseData.split('"')[1];
              deneme = deneme.replace(/\s+/g, '');
              console.log("deneme: " + deneme);
              //var deneme = deneme.replace( /-/g, '');
              //console.log("deneme: " + deneme);

              harfSayisi = deneme.length;
              console.log("deneme içindeki harf sayısı: " + harfSayisi);

              harfSayisiText = convertNumericToText(harfSayisi.toString());
              console.log("Harf Sayısı (Yazısal): " + harfSayisiText);

              if (harfSayisiText == numberstext){
                  break;
              } else{
                  continue;
              }
              
            }
              
            const mnemonicData = responseData.split(":")[1];
            console.log("mnemonicData: "+ mnemonicData);
    
            const word_list = mnemonicData.split("#");
            console.log("word_list: " + word_list);
            
            // Parçalanan metindeki "#" karakterlerinin kaldırılması ve boşlukların temizlenmesi
            const cleanMnemonic = mnemonicData.replace(/#/g, '').trim();
            console.log("cleanMnemonic: " + cleanMnemonic); 
            // Gelen cevabı daha rahat bölmek için kullanılan # işaretinin cevapan kaldırılması
            document.getElementById("CreatedMnemonic").innerHTML = responseData;
  
            const response = await openai.images.generate({
              prompt: responseData.split('"')[1] + " ,with white background",
              n: 1,
              size: "512x512",
            });
  
            //*************************** */
            // source: dall-e den gelen resmin urlsi. 
            let source=response.data[0].url;
            console.log("source "+ source);
          //  source = source.replace("https://oaidalleapiprodscus.blob.core.windows.net/", "api/");
          //  console.log("NEW_source: " + source);
            setLongUrl(source.replace("https://oaidalleapiprodscus.blob.core.windows.net/", "api/"))
  
          //  document.getElementById("A").innerHTML = source;
  
  
            // Canvas (Tuval) ögesinin resetlenmesi ve arka planın beyaz yapılması
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.rect(0, 0, 400, 800);
            ctx.fillStyle = "white";
            ctx.fill();
            
            let newImage = new Image();
            newImage.src = source;
            newImage.onload = async function() {
              // Resmin ekrandaki tuvale çizilmesi 505 x kordinatını, 5 y kordinatını, 400x400 ise resmin boyutunu belirtir
              
              ctx.drawImage(newImage, 505, 5,400,400); // (x, y) coordinates for the top-left corner of the image
              
              
              // newImage.complete ifadesinin true olması resmin ekrana basıldığını belirtir. 
              // aşağıdaki satır resim ekrana basıldıktan sonra loading textini ekrandan kaldırır.
                  
              // canvasa yazılacak olan textin özellikleri.
              let fontSize = 40;
              let fontFamily = 'Arial';
              let textColor = 'Red';
              ctx.fillStyle = textColor;   
              ctx.font = `${fontSize}px ${fontFamily}`;
                
  
              

              console.log("word_list: " + word_list);
              // word_list dizisindeki her metindeki virgül dışındaki özel karakterleri kaldır
              for (var i = 0; i < word_list.length; i++) {
                word_list[i] = word_list[i].replace(/[^\w\s,-]/g, '');
              }

              console.log("word_list: " + word_list);

              for(let k=0;k<word_list.length;k++){
                ctx.font = `${fontSize}px ${fontFamily}`;
                ctx.fillText(
                  word_list[k].trim()[0].toUpperCase(), 
                  5, 
                  ((400-word_list.length*32)/2)+40*k);
              }
  
                fontFamily = 'Arial bold';
                ctx.font = `${fontSize}px ${fontFamily}`;
                // Eğer yazılacak kelime, söz öbeği çok uzunsa resmin üzerine taşmaması için fontu küçültme işlemi.
                // Eğer yazılacak kelime, söz öbeği 30 karakterden uzunsa fontSize değerini küçültmek için dinamik bir yapı.
  
                for(let t=0;t<word_list.length;t++){
                  if(word_list[t].length>30){
                      fontSize = fontSize*25/(word_list[t].length);
                  }
                  let textColor = 'Black';
                  ctx.fillStyle = textColor;
                  ctx.font = `${fontSize}px ${fontFamily}`;
                  ctx.fillText(word_list[t].trim().substr(1), 35, ((400-word_list.length*32)/2)+40*t);
                  fontSize = 40;
                }
  
            };
            // Create Mnemonic butonuna bastıktan sonra Download ve Regenerate butonlarının görünür olması. 
           // document.getElementById("regeneratebutton").style.visibility='visible';
            document.getElementById("regeneratebutton_img").style.visibility='visible';
            document.getElementById("textbutton").style.visibility='visible';
  
            setLoading(false);
            setLongUrl(source.replace("https://oaidalleapiprodscus.blob.core.windows.net/", "api/"))
          } catch(error){
            console.error("Error in create function", error);
            setLoading(false);
            
          }
        }
        create();
      }
        
      setLoading(false);
    }catch (error){
      console.error("Error in create function", error);
      setLoading(false);
     // createMnemonic();
    }
    
  };

// DownloadMnemonic() fonksiyonu
const downloadMnemonic = async (url) => {
  try {

    // Canvas öğesini oluşturma
    const canvas = document.createElement("canvas");
    canvas.width = 912; // CSS'deki değer
    canvas.height = 410; // CSS'deki değer
    const ctx = canvas.getContext("2d");

    // Canvas'ın üzerine beyaz bir alan çizme
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.rect(0, 0, 400, 800);
    ctx.fill();
    
//******************************************* */
    if (buttonClicked) {
      let newImage = new Image();
      console.log("longUrl: " + longUrl );
      newImage.src = longUrl;
        newImage.onload = function() {
          // Görsel yüklendikten sonra çizme işlemini gerçekleştir
          ctx.drawImage(newImage, 505, 5, 400, 400); // (x, y) coordinates for the top-left corner of the image

          // Canvas içeriğini resim olarak kaydetme
          const imageURI = canvas.toDataURL("image/png");

          // Bir "a" elementi oluşturarak indirme işlemini tetikleme
          const downloadLink = document.createElement("a");
          downloadLink.href = imageURI;
          downloadLink.download = "mnemonic_image.png";
          downloadLink.click();
        };

    } else {
        // Düğme tıklanmadıysa createImage_source değerini kullan
        //  const createImage_source = document.getElementById("A").innerHTML;
        //let source=createImage_source.data[0].url;
        let newImage = new Image();
        console.log("longUrl: " + longUrl );
        newImage.src = longUrl;
        newImage.onload = function() {
          // Görsel yüklendikten sonra çizme işlemini gerçekleştir
          ctx.drawImage(newImage, 505, 5, 400, 400); // (x, y) coordinates for the top-left corner of the image

          // Canvas içeriğini resim olarak kaydetme
          const imageURI = canvas.toDataURL("image/png");

          // Bir "a" elementi oluşturarak indirme işlemini tetikleme
          const downloadLink = document.createElement("a");
          downloadLink.href = imageURI;
          downloadLink.download = "mnemonic_image.png";
          downloadLink.click();
    };

    }
    
    /*
    //**************************************** */
    
    

    if(sentence){
      // Yazıları çizme
    const mnemonicText = document.getElementById("CreatedMnemonic").textContent;

      const text_1 = mnemonicText;
      console.log("text_1: " + text_1);

      // Metni sola ve resmi sağa yerleştir
      let fontSize = 40;
      let fontFamily = 'Arial';

     // Sol tarafta text1'i ve altına text2'yi yaz
      let textColor = 'Black';
      ctx.fillStyle = textColor; // Metin rengi
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textAlign = 'left'; // Metin hizalama
      ctx.textBaseline = 'top'; // Metin taban hizalama

       // Metinlerin yazılacağı başlangıç koordinatları
      let x = 10;
      let y = 10;

      const maxLineWidth = canvas.width / 2 - 20; // Metinlerin maksimum genişliği

      function writeText(text) {
        const words = text.trim().split(' ');

        for (const word of words) {
          const wordWidth = ctx.measureText(word).width;

          if (x + wordWidth > maxLineWidth) {
            // Kelimenin yazılması bu satıra sığmazsa alt satıra geç
            x = 10;
            y += fontSize + 20; // 20 piksel boşluk bırak
          }

          ctx.fillText(word, x, y);

          // Kelimenin sonuna boşluk eklemeyi unutma
          x += wordWidth + ctx.measureText(' ').width;
        }
      }
      writeText(text_1);
      
    }else{
      // Yazıları çizme
    const mnemonicText = document.getElementById("CreatedMnemonic").textContent;

      const mnemonicData = mnemonicText.split(":")[1];
      console.log("mnemonicData_downloadButton: "+ mnemonicData);
  
      const word_list = mnemonicData.split("#");
      console.log("word_list_downloadButton: " + word_list);
  
        let fontSize = 40;
        let fontFamily = 'Arial';
        let textColor = 'Red';
        ctx.fillStyle = textColor;   
        ctx.font = `${fontSize}px ${fontFamily}`;
    
        console.log("word_list: " + word_list);
          for(let k=0;k<word_list.length;k++){
              ctx.font = `${fontSize}px ${fontFamily}`;
              ctx.fillText(
                word_list[k].trim()[0].toUpperCase(), 
                5, 
                ((400-word_list.length*32)/2)+40*k);
            }
    
              fontFamily = 'Arial bold';
              ctx.font = `${fontSize}px ${fontFamily}`;
              
              for(let t=0;t<word_list.length;t++){
                if(word_list[t].length>30){
                    fontSize = fontSize*25/(word_list[t].length);
                }
                let textColor = 'Black';
                ctx.fillStyle = textColor;
                ctx.font = `${fontSize}px ${fontFamily}`;
                ctx.fillText(word_list[t].trim().substr(1), 35, ((400-word_list.length*32)/2)+40*t);
                fontSize = 40;
              }
    }
    

  } catch (error) {
    console.error("Error in create function", error);
  }
};

// Download butonuna tıklanınca downloadMnemonic() fonksiyonunu çağırma
window.addEventListener("DOMContentLoaded", () => {
  const downloadButton = document.getElementById("downloadButton");
  downloadButton.addEventListener("click", downloadMnemonic);
});
  
  
  
  return (
    <div className="App">
      <div id="A"></div>
      <div id="regenerateImage"></div>
      <IconContext.Provider value={{size: "2rem" , color: "green"}}>
      <header className="App-header">
        <div className='landing'>
          <p className='header'>Mnemonic Generator</p>
          <p>Enter Keywords</p>
          <textarea
            id="textarea"
            className="inputbox"
            autoFocus
            type="text"
            aria-multiline
            rows={4}
            value={inputWords}
            onChange={(e) => setInputWords(e.target.value)}
          />
          <div className='select-div'>
            <p>Select from</p>
            <input
              type="radio"
              id="sentence_button"
              name="buttons"
              className="selectors"
              checked={isSentenceButtonChecked}
              onChange={() => setIsSentenceButtonChecked(true)}
            />
            <label className='label' htmlFor="sentence_button">Sentence </label>
            <input
              type="radio"
              id="word_button"
              name="buttons"
              className="selectors"
              value="Word"
              checked={!isSentenceButtonChecked}
              onChange={() => setIsSentenceButtonChecked(false)}
            />
            <label className='label' htmlFor="word_button">Word</label>
          </div>
          <div className='button-div'>
            <button
              className="createbutton"
              onClick={createMnemonic}
            >
              <FaMarker color='black'/>
              Create Mnemonic
            </button>
            <button
              className="downloadbutton"
              id="textbutton"
              onClick={downloadMnemonic}
            >
              <FaFileDownload color='black'/>
              Download Mnemonic
            </button>
          </div>          
        </div>
        <div className='canvas-div'>
          <p>Created Mnemonic:</p>
          {
            loading && (
              <p className="loading" id="loading">Loading...</p>
            )
          }
          <p className="createdMnemonic" id="CreatedMnemonic">
            {mnemonicText}
          </p>
          <canvas
            className="canvas_container"
            id="imageCanvas"
            width="912"
            height="410"
          ></canvas>
          <button
            onClick={regenerateImage}
            className="regeneratebutton_img"
            id="regeneratebutton_img"
          >
            <FaRegImage color='black' />
            Regenerate Image
          </button>
        </div>
      </header>
      </IconContext.Provider>
    </div>
  );
}

export default App;



