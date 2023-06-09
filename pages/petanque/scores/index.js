import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Navigation from "../../components/Navigation";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export async function getServerSideProps () {
  const { data: scores } = await supabase.from('petanque').select('*');
  const { data: players } = await supabase.from('players').select('*');

    return {
      props: {
       scores: scores,
       players: players
      },
    }
}

export default function Scores(data) {
const [score, setScore] = useState()

const playerData = data.players
const scoreData = data.scores

const days = []
scoreData.forEach(el => days.push(el.created_at.slice(0,10)))

let uniqueDays = [...new Set(days)]

const handleInputs = (e) => {
  const {name, value} = e.target
  setScore(prev => {
    return {
      ...prev,
      [name]: value,
    }
  })

}

async function submitScore() {
  if (!score || !score.winner || !score.winner_points || !score.loser) {
    return
  }
  else (
    await supabase
    .from('petanque')
    .insert(score)

  )
  alert("dodano wynik")
  setTimeout(() => {
    location.reload()
  }, 1000)
}


  return (
    <>
    <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
            <li>
              <Link href="/">Strona główna</Link>
            </li>
            <li>
              <Link href="/petanque/table">Tabela</Link>
            </li>
            <li>
              <Link href="/petanque/scores">Wyniki</Link>
            </li>
            <li>
              <Link href="/petanque/players">Gracze</Link>
            </li>
            </ul>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex w-full justify-center">
          <ul className="menu menu-horizontal px-1">
            <li className="px-4">
              <Link href="/">Strona główna</Link>
            </li>
            <li className="px-4">
              <Link href="/petanque/table">Tabela</Link>
            </li>
            <li className="px-4">
              <Link href="/petanque/scores">Wyniki</Link>
            </li>
            <li className="px-4">
              <Link href="/petanque/players">Gracze</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="min-h-screen bg-cover bg-no-repeat bg-center bg-petanque flex flex-col justify-center content-center">
        <div className="drawer drawer-end">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* <!-- Page content here --> */}
            <div className="container m-auto">
              {uniqueDays.map((el, i) => (

                <div key={i} className="collapse mx-auto py-10">
                <input type="checkbox" className="peer" />
                <div className="bg-gray-300 rounded opacity-80 collapse-title text-black text-center text-xl font-semibold peer-checked:rounded-b-none">
                  {el}
                </div>
                <div className="bg-gray-300 opacity-80 rounded collapse-content peer-checked:rounded-t-none">
                  <div className="overflow-x-auto">
                    <table className="table table-zebra w-full opacity-80">
                      {/* head */}
                      <thead>
                        <tr>
                          <th>Gracz 1</th>
                          <th>wynik</th>
                          <th>gracz 2</th>
                        </tr>
                      </thead>
                      <tbody>
                      {scoreData.filter(el => 
                          el.created_at.slice(0,10) === uniqueDays[i]
                        ).map((el, i) => (
                          <tr key={i}>
                          <td>{el.winner}</td>
                          <td>{el.winner_points} - {el.loser_points}</td>
                          <td>{el.loser}</td>
                        </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              ))}
              
            </div>
            <div className="container flex justify-center m-auto">
              <label
                htmlFor="my-drawer-4"
                className="drawer-button  opacity-80 bg-gray-500 btn m-auto"
              >
                Dodaj wynik
              </label>
            </div>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer-4" className="drawer-overlay"></label>
            <ul className="menu p-4 w-80 bg-base-100 text-base-content">
              {/* <!-- Sidebar content here --> */}
              <li className="py-10">
                <select onChange={handleInputs} name="winner" className="select select-bordered w-full max-w-xs">
                  <option disabled selected>
                    Wygrany
                  </option>
                  {playerData.map((el, i) => (
                    <option key={i}>{el.name}</option>
                  ))}
                </select>
                <input onChange={(e) => handleInputs(e)} name="winner_points" type="number" placeholder="punkty" className="input input-bordered w-full max-w-xs"/>
              </li>
              <li className="py-10">
                <select onChange={handleInputs} name="loser" className="select select-bordered w-full max-w-xs">
                  <option disabled selected>
                    Gracz 2
                  </option>
                  {playerData.map((el, i) => (
                    <option key={i}>{el.name}</option>
                  ))}
                </select>
                {/* <input onChange={handleInputs} name="player_2_points" type="number" placeholder="punkty" className="input input-bordered w-full max-w-xs"/> */}
              </li>
              <button onClick={submitScore} className="btn">Zapisz</button>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
