<template>
  <div id="form-block4" class="text-left mt-5 mx-3">
    <h4 class="mb-3">Praktikumssuche</h4>
    <div class="card text-white bg-success mt-2 mb-4 ms-3">
      <div class="card-body p-1">
        <p class="card-text"><strong>Hinweis:</strong>
          Starte am besten mit einer möglichst spezifischen Suche,
          da die Ergebnisanzeige auf 12 Ergebnisse beschränkt ist.
          Firmen, die Du einmal gesehen hast, bleiben auch nach dem
          erreichen des Limits sichtbar. Solltest das Limit aus
          irgendeinem Grund nicht ausreichen, kannst du in
          Ausnahmefällen per Mail an imi-praktikum[at]htw-berlin.de um eine Zurücksetzung bitten.
        </p>
      </div>
    </div>

    <div class="container" style="max-width: 100vw;">
      <form role="form"
            class="new_search"
            id="new_search"
            action="/de/confirm_results"
            method="post"
      >
        <input type="hidden" name="authenticity_token">
        <div id="search_options" class="row ps-3">
          <p class="me-2 ms-2">Ich suche nach</p>
          <div class="form-group" data-children-count="1">
            <label class="sr-only" for="search_paid">Paid</label>
            <select class="form-control chzn-select me-2 w-auto h-auto"
                    name="search[paid]"
                    id="search_paid"
            >
              <option value="">(un)bezahlten</option>
              <option value="true">bezahlten</option>
              <option value="false">unbezahlten</option>
            </select>
          </div>
          <p class="me-2">Praktika in</p>
          <div class="form-group" data-children-count="1">
            <label class="sr-only" for="search_location">Location</label>
            <select class="form-control chzn-select me-2 w-auto h-auto"
                    name="search[location]"
                    id="search_location"
            >
              <option value="">einer schönen Location</option>
              <option value="Afghanistan">Afghanistan</option>
              <option value="Argentinien">Argentinien</option>
              <option value="Australien">Australien</option>
              <option value="Belgien">Belgien</option>
              <option value="Brasilien">Brasilien</option>
              <option value="Bulgarien">Bulgarien</option>
              <option value="Chile">Chile</option>
              <option value="China">China</option>
              <option value="Deutschland">Deutschland</option>
              <option value="Dominikanische Republik">Dominikanische Republik</option>
              <option value="Dänemark">Dänemark</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Estland">Estland</option>
              <option value="Finnland">Finnland</option>
              <option value="Frankreich">Frankreich</option>
              <option value="Ghana">Ghana</option>
              <option value="Griechenland">Griechenland</option>
              <option value="Hongkong">Hongkong</option>
              <option value="Indien">Indien</option>
              <option value="Indonesien">Indonesien</option>
              <option value="Irland">Irland</option>
              <option value="Israel">Israel</option>
              <option value="Italien">Italien</option>
              <option value="Japan">Japan</option>
              <option value="Kanada">Kanada</option>
              <option value="Katar">Katar</option>
              <option value="Korea, Demokratische Volksrepublik">
                Korea, Demokratische Volksrepublik
              </option>
              <option value="Kroatien">Kroatien</option>
              <option value="Luxemburg">Luxemburg</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Malta">Malta</option>
              <option value="Mauritius">Mauritius</option>
              <option value="Mexiko">Mexiko</option>
              <option value="Mongolei">Mongolei</option>
              <option value="Myanmar">Myanmar</option>
              <option value="Neuseeland">Neuseeland</option>
              <option value="Niederlande">Niederlande</option>
              <option value="Norwegen">Norwegen</option>
              <option value="Panama">Panama</option>
              <option value="Peru">Peru</option>
              <option value="Polen">Polen</option>
              <option value="Portugal">Portugal</option>
              <option value="Rumänien">Rumänien</option>
              <option value="Schweden">Schweden</option>
              <option value="Schweiz">Schweiz</option>
              <option value="Serbien">Serbien</option>
              <option value="Singapur">Singapur</option>
              <option value="Slowakei">Slowakei</option>
              <option value="Spanien">Spanien</option>
              <option value="Südafrika">Südafrika</option>
              <option value="Thailand">Thailand</option>
              <option value="Tschechien">Tschechien</option>
              <option value="Türkei">Türkei</option>
              <option value="Ukraine">Ukraine</option>
              <option value="Vereinigte Staaten">Vereinigte Staaten</option>
              <option value="Vereinigtes Königreich">Vereinigtes Königreich</option>
              <option value="Vietnam">Vietnam</option>
              <option value="Österreich">Österreich</option>
              <option disabled="disabled" value="------">------</option>
              <option value=" BERLIN"> BERLIN</option>
              <option value=" Berlin"> Berlin</option>
              <option value="'s-Hertogenbosch">'s-Hertogenbosch</option>
              <option value="Adeje, Tenerife">Adeje, Tenerife</option>
              <option value="Alocobendos-Madrid">Alocobendos-Madrid</option>
              <option value="Amersfoort">Amersfoort</option>
              <option value="Amstelveen">Amstelveen</option>
              <option value="Amsterdam">Amsterdam</option>
              <option value="Antwerpen">Antwerpen</option>
              <option value="Arvidsjaur">Arvidsjaur</option>
              <option value="Auckland">Auckland</option>
              <option value="Austin">Austin</option>
              <option value="Avieiro">Avieiro</option>
              <option value="BN Utrecht">BN Utrecht</option>
              <option value="Bad Soden /Zagreb">Bad Soden /Zagreb</option>
              <option value="Bahar ic-Caghaq">Bahar ic-Caghaq</option>
              <option value="Bali ">Bali</option>
              <option value="Balzan">Balzan</option>
              <option value="Bangkok">Bangkok</option>
              <option value="Barcelona">Barcelona</option>
              <option value="Bath">Bath</option>
              <option value="Beijing">Beijing</option>
              <option value="Belfast">Belfast</option>
              <option value="Bellevue">Bellevue</option>
              <option value="Bergen">Bergen</option>
              <option value="Berlgrad">Berlgrad</option>
              <option value="Berlin">Berlin</option>
              <option value="Berlin ">Berlin</option>
              <option value="Berlin/Dona-Lusail">Berlin/Dona-Lusail</option>
              <option value="Bern">Bern</option>
              <option value="Betzdorf">Betzdorf</option>
              <option value="Birmingham">Birmingham</option>
              <option value="Bochum">Bochum</option>
              <option value="Bonn">Bonn</option>
              <option value="Bordeux">Bordeux</option>
              <option value="Bottighofen">Bottighofen</option>
              <option value="Boulder">Boulder</option>
              <option value="Boumemouth">Boumemouth</option>
              <option value="Brande">Brande</option>
              <option value="Bratislava">Bratislava</option>
              <option value="Bremen">Bremen</option>
              <option value="Breslau">Breslau</option>
              <option value="Brighton">Brighton</option>
              <option value="Bristol">Bristol</option>
              <option value="Brooklyn, New York">Brooklyn, New York</option>
              <option value="Bruessels">Bruessels</option>
              <option value="Brunnen">Brunnen</option>
              <option value="Bukarest">Bukarest</option>
              <option value="CABA">CABA</option>
              <option value="Cabarete">Cabarete</option>
              <option value="Cairns, Queensland">Cairns, Queensland</option>
              <option value="Calgary">Calgary</option>
              <option value="Camarillo">Camarillo</option>
              <option value="Camberley">Camberley</option>
              <option value="Cambridge">Cambridge</option>
              <option value="Cambridge, MA">Cambridge, MA</option>
              <option value="Cape Town">Cape Town</option>
              <option value="Chengdu">Chengdu</option>
              <option value="Cindad de Mexico">Cindad de Mexico</option>
              <option value="Cluj-Napoca">Cluj-Napoca</option>
              <option value="Copenhagen">Copenhagen</option>
              <option value="Crencester">Crencester</option>
              <option value="Curitiba">Curitiba</option>
              <option value="Daejeon">Daejeon</option>
              <option value="Den Haag">Den Haag</option>
              <option value="Denizli">Denizli</option>
              <option value="Doha">Doha</option>
              <option value="Dortmund">Dortmund</option>
              <option value="Dublin">Dublin</option>
              <option value="Dublin 18">Dublin 18</option>
              <option value="Dublin 24">Dublin 24</option>
              <option value="Edinburgh">Edinburgh</option>
              <option value="Eindhoven">Eindhoven</option>
              <option value="El Gastor">El Gastor</option>
              <option value="El Salto Granadilla Teneriffa">El Salto Granadilla Teneriffa</option>
              <option value="Elstree">Elstree</option>
              <option value="Enschede">Enschede</option>
              <option value="Espoo">Espoo</option>
              <option value="Floriana">Floriana</option>
              <option value="Frankfurt am Main">Frankfurt am Main</option>
              <option value="Frederiksberg">Frederiksberg</option>
              <option value="Galway">Galway</option>
              <option value="Gdansk">Gdansk</option>
              <option value="Gent">Gent</option>
              <option value="Gothenburg">Gothenburg</option>
              <option value="Greenbelt">Greenbelt</option>
              <option value="Guadalajara">Guadalajara</option>
              <option value="Gzira">Gzira</option>
              <option value="Ha Noi">Ha Noi</option>
              <option value="Halfweg">Halfweg</option>
              <option value="Hamburg">Hamburg</option>
              <option value="Hampton">Hampton</option>
              <option value="Hanoi">Hanoi</option>
              <option value="Hayes, Middlesex">Hayes, Middlesex</option>
              <option value="Helsinki">Helsinki</option>
              <option value="Hilversum">Hilversum</option>
              <option value="Ho Chi Min">Ho Chi Min</option>
              <option value="Ho Chi Minh City">Ho Chi Minh City</option>
              <option value="Hod HaSharon">Hod HaSharon</option>
              <option value="Hofheim a.T.">Hofheim a.T.</option>
              <option value="Holzkirchen">Holzkirchen</option>
              <option value="Honcho, Kawaguchi-shi">Honcho, Kawaguchi-shi</option>
              <option value="Hong Kong">Hong Kong</option>
              <option value="Horgen">Horgen</option>
              <option value="Innsbruck">Innsbruck</option>
              <option value="Istanbul">Istanbul</option>
              <option value="Ivry Sur Seine">Ivry Sur Seine</option>
              <option value="Jakarta">Jakarta</option>
              <option value="Johor Bahru">Johor Bahru</option>
              <option value="Kalkutta">Kalkutta</option>
              <option value="Kapstadt">Kapstadt</option>
              <option value="Karlsruhe">Karlsruhe</option>
              <option value="Kayseri">Kayseri</option>
              <option value="Klang">Klang</option>
              <option value="Kopenhagen">Kopenhagen</option>
              <option value="Koppenhagen">Koppenhagen</option>
              <option value="Kuala Lumpur">Kuala Lumpur</option>
              <option value="Kyoto">Kyoto</option>
              <option value="Köln">Köln</option>
              <option value="Larissa">Larissa</option>
              <option value="Lashibi">Lashibi</option>
              <option value="Lennox Head">Lennox Head</option>
              <option value="Liebefeld">Liebefeld</option>
              <option value="Lima">Lima</option>
              <option value="Limoges ">Limoges</option>
              <option value="Lisboa">Lisboa</option>
              <option value="Lissabon">Lissabon</option>
              <option value="Lodndon">Lodndon</option>
              <option value="Lona">Lona</option>
              <option value="London">London</option>
              <option value="Luxembourg-Kirchberg">Luxembourg-Kirchberg</option>
              <option value="Lviv">Lviv</option>
              <option value="Lüneburg">Lüneburg</option>
              <option value="Madrid">Madrid</option>
              <option value="Maidenhead">Maidenhead</option>
              <option value="Malmö">Malmö</option>
              <option value="Manly">Manly</option>
              <option value="Mars">Mars</option>
              <option value="Martorell">Martorell</option>
              <option value="Mazar-e-Sharif">Mazar-e-Sharif</option>
              <option value="Melbourne">Melbourne</option>
              <option value="Menlo Park">Menlo Park</option>
              <option value="Miami">Miami</option>
              <option value="Milwaukee">Milwaukee</option>
              <option value="Minas Gerais - Belo Horizonte">Minas Gerais - Belo Horizonte</option>
              <option value="Mol">Mol</option>
              <option value="Montréal">Montréal</option>
              <option value="Mountain View">Mountain View</option>
              <option value="Msida">Msida</option>
              <option value="Munich">Munich</option>
              <option value="Mysore">Mysore</option>
              <option value="München">München</option>
              <option value="Nacka Strand">Nacka Strand</option>
              <option value="Nagoya">Nagoya</option>
              <option value="New Bern, NC">New Bern, NC</option>
              <option value="New York">New York</option>
              <option value="New York City">New York City</option>
              <option value="Newtownards">Newtownards</option>
              <option value="Nisantasi Istanbul">Nisantasi Istanbul</option>
              <option value="Odessa">Odessa</option>
              <option value="Oeiras">Oeiras</option>
              <option value="PT Bolsward">PT Bolsward</option>
              <option value="Palma de Mallorca">Palma de Mallorca</option>
              <option value="Palmerston North">Palmerston North</option>
              <option value="Palo Alto">Palo Alto</option>
              <option value="Panama, Clayton">Panama, Clayton</option>
              <option value="Paris">Paris</option>
              <option value="Pasching/Linz">Pasching/Linz</option>
              <option value="Pisa">Pisa</option>
              <option value="Pittsburgh, PA">Pittsburgh, PA</option>
              <option value="Port Louis">Port Louis</option>
              <option value="Potsdam">Potsdam</option>
              <option value="Prag">Prag</option>
              <option value="Prague">Prague</option>
              <option value="Praha 1">Praha 1</option>
              <option value="Praha 4-Krč">Praha 4-Krč</option>
              <option value="Procidencia, Santiago">Procidencia, Santiago</option>
              <option value="Puchong">Puchong</option>
              <option value="Puerto de la Cruz">Puerto de la Cruz</option>
              <option value="Reading">Reading</option>
              <option value="Rehovot">Rehovot</option>
              <option value="Rio de Janeiro">Rio de Janeiro</option>
              <option value="Riverdale">Riverdale</option>
              <option value="Rotterdam">Rotterdam</option>
              <option value="Salzburg">Salzburg</option>
              <option value="San Francisco">San Francisco</option>
              <option value="San Gwann">San Gwann</option>
              <option value="San Jose">San Jose</option>
              <option value="San Ramon">San Ramon</option>
              <option value="Sant Boi de Uobregat">Sant Boi de Uobregat</option>
              <option value="Santa Monica">Santa Monica</option>
              <option value="Santo Domingo de los Colorados">
                Santo Domingo de los Colorados
              </option>
              <option value="Sao Paolo">Sao Paolo</option>
              <option value="Schönefeld">Schönefeld</option>
              <option value="Seattle">Seattle</option>
              <option value="Selianitika">Selianitika</option>
              <option value="Shanghai">Shanghai</option>
              <option value="Sheffield">Sheffield</option>
              <option value="Singapore">Singapore</option>
              <option value="Singapur">Singapur</option>
              <option value="Sliema">Sliema</option>
              <option value="Smardzew">Smardzew</option>
              <option value="Sofia">Sofia</option>
              <option value="Solna">Solna</option>
              <option value="St. Andre">St. Andre</option>
              <option value="St. Georgen im Schwarzwald">St. Georgen im Schwarzwald</option>
              <option value="St. Julian's ">St. Julian's</option>
              <option value="Staines-upon-Thames">Staines-upon-Thames</option>
              <option value="Stavanger">Stavanger</option>
              <option value="Stockholm">Stockholm</option>
              <option value="Strasbourg cedex">Strasbourg cedex</option>
              <option value="Strassen">Strassen</option>
              <option value="Sutton, Dublin">Sutton, Dublin</option>
              <option value="Swindon">Swindon</option>
              <option value="Sydney">Sydney</option>
              <option value="Talca">Talca</option>
              <option value="Tallinn">Tallinn</option>
              <option value="Tel-Aviv">Tel-Aviv</option>
              <option value="Thalmässing">Thalmässing</option>
              <option value="Thane">Thane</option>
              <option value="The Hague">The Hague</option>
              <option value="Tijarafe">Tijarafe</option>
              <option value="Tiruchirapalli">Tiruchirapalli</option>
              <option value="Tokyo">Tokyo</option>
              <option value="Tokyo ">Tokyo</option>
              <option value="Toulouse">Toulouse</option>
              <option value="Tromso">Tromso</option>
              <option value="Tromsø">Tromsø</option>
              <option value="Ulan Bator">Ulan Bator</option>
              <option value="Ulm">Ulm</option>
              <option value="Unterhaching">Unterhaching</option>
              <option value="Urtenen-Schönbühl">Urtenen-Schönbühl</option>
              <option value="Utrecht">Utrecht</option>
              <option value="Valencia">Valencia</option>
              <option value="Vancouver, BC">Vancouver, BC</option>
              <option value="Venray">Venray</option>
              <option value="Växjö">Växjö</option>
              <option value="Wageningen">Wageningen</option>
              <option value="Wallisellen">Wallisellen</option>
              <option value="Watford">Watford</option>
              <option value="Wels">Wels</option>
              <option value="Wien">Wien</option>
              <option value="Winterthur">Winterthur</option>
              <option value="Wismar">Wismar</option>
              <option value="Wuhan">Wuhan</option>
              <option value="Wustermark">Wustermark</option>
              <option value="Yangon">Yangon</option>
              <option value="Zagreb">Zagreb</option>
              <option value="Zürich">Zürich</option>
              <option value="hanoi">hanoi</option>
              <option value="岐阜県各務原市">岐阜県各務原市</option>
            </select>
          </div>
          <p class="me-2">im Bereich</p>
          <div class="form-group" data-children-count="1">
            <label class="sr-only" for="search_orientation_id">Orientation</label>
            <select class="form-control chzn-select me-2 w-auto h-auto"
                    name="search[orientation_id]"
                    id="search_orientation_id"
            >
              <option value="">der Spaß macht</option>
              <option value="11">Administration/Support</option>
              <option value="10">Concept</option>
              <option value="6">Design</option>
              <option value="1">Game</option>
              <option value="8">Graphics/3D</option>
              <option value="5">Marketing</option>
              <option value="3">Mobile</option>
              <option value="7">Product Management</option>
              <option value="4">Software</option>
              <option value="9">Video</option>
              <option value="2">Web</option>
            </select>
          </div>
          <p class="me-2">mit der Programmiersprache</p>
          <div class="form-group" data-children-count="1">
            <label class="sr-only" for="search_programming_language_id">
              Programming language
            </label>
            <select class="form-control chzn-select w-auto h-auto"
                    name="search[programming_language_id]"
                    id="search_programming_language_id"
            >
              <option value="">die mich interessiert</option>
              <option value="1">Java</option>
              <option value="2">C++</option>
              <option value="3">C</option>
              <option value="4">C#</option>
              <option value="5">Ruby</option>
              <option value="6">PHP</option>
              <option value="7">Javascript</option>
              <option value="8">ASP.NET</option>
              <option value="9">HTML/CSS</option>
              <option value="10">Python</option>
              <option value="11">Perl</option>
              <option value="12">Haskell</option>
              <option value="13">Lisp</option>
              <option value="14">Erlang</option>
              <option value="15">Scala</option>
              <option value="16">Objective-C</option>
              <option value="17">Visual Basic</option>
              <option value="18">Visual Basic .NET</option>
              <option value="19">Transact-SQL</option>
              <option value="20">Pascal</option>
              <option value="21">Bash</option>
              <option value="22">Delphi / Object Pascal</option>
              <option value="23">PL / SQL</option>
              <option value="24">Assembly</option>
              <option value="25">Lua</option>
              <option value="26">MATLAB</option>
              <option value="27">SAS</option>
              <option value="28">Ada</option>
              <option value="29">R</option>
              <option value="30">ABAP</option>
              <option value="31">COBOL</option>
              <option value="32">Fortran</option>
              <option value="33">Scheme</option>
              <option value="34">Prolog</option>
              <option value="35">Common Lisp</option>
              <option value="36">Scratch</option>
              <option value="37">D</option>
              <option value="38">Basic</option>
              <option value="39">Logo</option>
              <option value="40">NXT-G</option>
              <option value="41">F#</option>
              <option value="42">Smalltalk</option>
              <option value="43">APL</option>
              <option value="44">Forth</option>
              <option value="45">ActionScript</option>
              <option value="46">ML</option>
              <option value="47">RPG (OS/400)</option>
              <option value="48">Awk</option>
              <option value="49">Tcl</option>
              <option value="50">PL/I</option>
              <option value="51">LabVIEW</option>
              <option value="52">Ladder Logic</option>
              <option value="53">JScript.NET</option>
              <option value="54">Swift</option>
              <option value="55">Go</option>
              <option value="57">Kotlin</option>
            </select></div>
        </div>
        <div class="btn-group" role="group">
          <div class="field me-2">
            <input type="submit"
                   name="commit"
                   value="Suchen"
                   class="btn btn-success"
                   data-disable-with="Suchen"
            >
          </div>
          <form role="form" class="new_search" action="/de/shuffle" method="post">
            <input type="hidden" name="authenticity_token" value="">
            <div class="field">
              <input type="submit"
                     name="commit"
                     value="Zufallsvorschlag"
                     class="btn btn-success text-white"
                     data-disable-with="Zufallsvorschlag"
              >
            </div>
          </form>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Search',
});
</script>

<style scoped>

</style>
