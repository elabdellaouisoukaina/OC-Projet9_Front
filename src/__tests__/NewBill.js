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
import mockStore from "../__mocks__/store"





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

        describe('When I fill correctly the form and click on the "Envoyer" button', () => { // test unitaire
          test('Then the form should be valid', () => {
            //Teste que le click sur le bouton appelle la bonne fonction
            const onNavigate = (pathname) => {
              document.body.innerHTML = ROUTES({ pathname })
            }
            const store = null
            const newBill = new NewBill({ document, onNavigate, store, localStorage })

            const inputExpenseType = screen.getByTestId("expense-type");
            fireEvent.change(inputExpenseType, { target: { value: "Transports" } });
            expect(inputExpenseType.value).toBe("Transports");

            const inputExpenseName = screen.getByTestId("expense-name");
            fireEvent.change(inputExpenseName, { target: { value: "Test" } });
            expect(inputExpenseName.value).toBe("Test");

            const inputExpenseDate = screen.getByTestId("datepicker");
            fireEvent.change(inputExpenseDate, { target: { value: "2018-01-04" } });
            expect(inputExpenseDate.value).toBe( "2018-01-04");

            const inputExpenseAmount = screen.getByTestId("amount");
            fireEvent.change(inputExpenseAmount, { target: { value: "0" } });
            expect(inputExpenseAmount.value).toBe("0");

            const inputExpenseVat = screen.getByTestId("vat");
            fireEvent.change(inputExpenseVat, { target: { value: "0" } });
            expect(inputExpenseVat.value).toBe("0");

            const inputExpensePct = screen.getByTestId("pct");
            fireEvent.change(inputExpensePct, { target: { value: "0" } });
            expect(inputExpensePct.value).toBe("0");

            const inputExpenseCommentary = screen.getByTestId("commentary");
            fireEvent.change(inputExpenseCommentary, { target: { value: "test test test" } });
            expect(inputExpenseCommentary.value).toBe("test test test");
            
            const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
            let uploadFileInput = screen.getByTestId("file")
            const jpegFile = new File([new Blob()], 'test.jpeg', {
              type: 'image/jpeg',
            });
            uploadFileInput.addEventListener('click', handleChangeFile) 
            userEvent.click(uploadFileInput, { target: { files: [jpegFile] } });
            expect(jpegFile.type === 'image/jpeg').toBeTruthy();
  

            const form = screen.getByTestId("form-new-bill");
            const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
            form.addEventListener("submit", handleSubmit);
            fireEvent.submit(form);
            expect(handleSubmit).toHaveBeenCalled()
            expect(form).toBeTruthy();

          })
        })

        describe("When i fill correctly the form", () => {
          test('Then the form should be successfully submitted', () => {
            document.body.innerHTML = NewBillUI()
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
              type: 'Employee'
            }))

            const onNavigate = (pathname) => {
              document.body.innerHTML = ROUTES({ pathname })
            }

            const store = mockStore;
            const newBill = new NewBill({ document, onNavigate, store, localStorage })

            const form = screen.getByTestId("form-new-bill");
            const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
            form.addEventListener("submit", handleSubmit);
            fireEvent.submit(form);
            expect(handleSubmit).toHaveBeenCalled()
          })
        })

        describe("When i fill correctly the form but there's an error with the API", () => { // test d'intégration
          test('Then an error 404 should appear in the console', async () => { 
            const spyError = jest.spyOn(console, "error");
            document.body.innerHTML = NewBillUI()
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
              type: 'Employee'
            }))

            //Teste que le click sur le bouton appelle la bonne fonction
            const onNavigate = (pathname) => {
              document.body.innerHTML = ROUTES({ pathname })
            }

            const store = {
              bills() {
                return {
                  list:  jest.fn(() => []),
                  create: jest.fn(() => Promise.resolve({})), // crée facture
                  update: jest.fn(() => Promise.reject(new Error("404"))), // envoi facture
                }
              }
              
            };
            const newBill = new NewBill({ document, onNavigate, store, localStorage })

            const form = screen.getByTestId("form-new-bill");
            const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
            form.addEventListener("submit", handleSubmit);
            fireEvent.submit(form);

            waitFor( () => {
              expect(spyError).toBeCalled();
            })            
          })

          test('Then an error 500 should appear in the console', async () => { 
            const spyError = jest.spyOn(console, "error");
            document.body.innerHTML = NewBillUI()
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
              type: 'Employee'
            }))

            //Teste que le click sur le bouton appelle la bonne fonction
            const onNavigate = (pathname) => {
              document.body.innerHTML = ROUTES({ pathname })
            }

            const store = {
              bills() {
                return {
                  list:  jest.fn(() => []),
                  create: jest.fn(() => Promise.resolve({})),
                  update: jest.fn(() => Promise.reject(new Error("500"))),
                }
              }
              
            };
            const newBill = new NewBill({ document, onNavigate, store, localStorage })

            const form = screen.getByTestId("form-new-bill");
            const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
            form.addEventListener("submit", handleSubmit);
            fireEvent.submit(form);

            waitFor( () => {
              expect(spyError).toBeCalled();
            })
          })
        })
      })
    })
  })
})





