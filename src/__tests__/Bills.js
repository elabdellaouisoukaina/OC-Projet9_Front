/**
 * @jest-environment jsdom
 */

import {fireEvent, screen, waitFor} from "@testing-library/dom"
import userEvent from '@testing-library/user-event';
import BillsUI from "../views/BillsUI.js"
import Bills from '../containers/Bills.js';
import { bills } from "../fixtures/bills.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import router from "../app/Router.js";


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      expect(windowIcon.className).toEqual('active-icon')
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    // Pour coverage à 100% de containers/Bills.js :

    // - Tester le fait de pouvoir créer une nouvelle facture 
    //   (bouton nouvelle note de frais)
    describe('When i click on the "Nouvelle note de frais" button', () => {
      test("Then a form to create a new bill should appear", () => {

        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'Employee'
        }))
        document.body.innerHTML = BillsUI({ data: bills })
        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        }
        const store = null
        const bill = new Bills({ document, onNavigate, store, localStorage })
  
        // Teste si le click fonctionne
        const buttonNewBill = screen.getByTestId("btn-new-bill")
        const handleClickNewBill = jest.fn(() => bill.handleClickNewBill())
        buttonNewBill.addEventListener("click", handleClickNewBill)
        fireEvent.click(buttonNewBill)
        expect(handleClickNewBill).toHaveBeenCalled()
        
        // Teste si le formulaire apparait
        const form = screen.queryByTestId("form-new-bill")
        expect(form).toBeTruthy()

      })

      // - Tester le fait de pouvoir ouvrir le justificatif 
      //   (icon eye)
      describe("When i click on one of the icon eyes", () => {
        test("Then a modal with the file should open", () => {
          Object.defineProperty(window, 'localStorage', { value: localStorageMock })
          window.localStorage.setItem('user', JSON.stringify({
            type: 'Employee'
          }))
          document.body.innerHTML = BillsUI({ data: bills })
          const onNavigate = (pathname) => {
            document.body.innerHTML = ROUTES({ pathname })
          }
          const store = null
          const bill = new Bills({ document, onNavigate, store, localStorage })
    
          const tableBody = screen.getByTestId("tbody");
          const rows = tableBody.getElementsByTagName("tr");

          for (var i = 0; i < rows.length; i++) {
            const row = rows[i];
            var lastCel = row.getElementsByTagName("td")[5];
            lastCel = lastCel.getElementsByTagName("div")[0];

            const eye = lastCel.getElementsByTagName("div")[0]
            const handleClickIconEye = jest.fn(() => bill.handleClickIconEye(eye))

            // Teste si le click fonctionne
            eye.addEventListener('click', handleClickIconEye(eye))
            userEvent.click(eye)
            expect(handleClickIconEye).toHaveBeenCalled()

            // Teste si la modale s'ouvre
            const modale = screen.getByTestId('modaleFileEmployee')
            expect(modale).toBeTruthy()
          }       
        })
      })
    })

    // - Tester si page est chargée

    // - Tester si y a une erreur, qu'on la voit
  })
})
