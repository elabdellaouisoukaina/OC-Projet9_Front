/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom"
import userEvent from '@testing-library/user-event';
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import router from "../app/Router.js"




describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then I should see a form", async () => {

      // Vérifie que le formulaire s'affiche
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)

      await waitFor(() => screen.getByTestId('form-new-bill'))
      const form = screen.getByTestId('form-new-bill')
      expect(form).toBeTruthy()
    })

    describe("When I click on the upload button", () => {
      describe("When the format of the file is something else than JPEG/JPG/PNG", () => {
        test("Then the file should not have been uploaded", async () => {

          document.body.innerHTML = NewBillUI()
          Object.defineProperty(window, 'localStorage', { value: localStorageMock })
          window.localStorage.setItem('user', JSON.stringify({
            type: 'Employee'
          }))
          const onNavigate = (pathname) => {
            document.body.innerHTML = ROUTES({ pathname })
          }
          const store = null
          const newBill = new NewBill({ document, onNavigate, store, localStorage })
          const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
          let uploadFileInput = screen.getByTestId("file")
          const file = new File(['test file content'], 'test.txt', {
              type: 'text/plain',
          });

          uploadFileInput.addEventListener('click', handleChangeFile) 
          fireEvent.click(uploadFileInput, { target: { files: [file] } });

          const testFile = screen.getByTestId("file")
          expect(testFile.value === "").toBeTruthy() 
        })
      })

      describe("When the format of the file is JPEG/JPG/PNG", () => {
        test("Then the file should have been uploaded", async () => {

          document.body.innerHTML = NewBillUI()
          Object.defineProperty(window, 'localStorage', { value: localStorageMock })
          window.localStorage.setItem('user', JSON.stringify({
            type: 'Employee'
          }))
          const onNavigate = (pathname) => {
            document.body.innerHTML = ROUTES({ pathname })
          }
          const store = null
          const newBill = new NewBill({ document, onNavigate, store, localStorage })
          const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
          let uploadFileInput = screen.getByTestId("file")


          const jpegFile = new File([new Blob()], 'test.jpeg', {
            type: 'image/jpeg',
          });
          uploadFileInput.addEventListener('click', handleChangeFile) 
          userEvent.click(uploadFileInput, { target: { files: [jpegFile] } });
          expect(jpegFile.type === 'image/jpeg').toBeTruthy();

          const jpgFile = new File([new Blob()], 'test.jpg', {
            type: 'image/jpg',
          });
          uploadFileInput.addEventListener('click', handleChangeFile) 
          userEvent.click(uploadFileInput, { target: { files: [jpgFile] } });
          expect(jpgFile.type === 'image/jpg').toBeTruthy();
          
          const pngFile = new File([new Blob()], 'test.png', {
            type: 'image/png',
          });
          uploadFileInput.addEventListener('click', handleChangeFile) 
          userEvent.click(uploadFileInput, { target: { files: [pngFile] } });
          expect(pngFile.type === 'image/png').toBeTruthy()
        })
    })
  })
})
