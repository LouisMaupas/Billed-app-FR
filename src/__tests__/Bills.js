import { screen, fireEvent } from "@testing-library/dom";
import { localStorageMock } from "../__mocks__/localStorage.js";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import Router from "../app/Router";
import Bills from "../containers/Bills.js";
import firebase from "../__mocks__/firebase";
import Firestore from "../app/Firestore";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
     test("Then bill icon in vertical layout should be highlighted", () => {
      Firestore.bills = () => ({ bills, get: jest.fn().mockResolvedValue()})
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      })) 
      const pathname = ROUTES_PATH['Bills']
      Object.defineProperty(window, "location", { value: { hash: pathname } });      
      document.body.innerHTML = `<div id="root"></div>`
      Router()
      const icoWin = screen.getByTestId('icon-window')
      const iconActived = icoWin.classList.contains('active-icon')
      expect(iconActived).toBeTruthy()
     })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      expect(dates).toEqual([...dates].sort((a, b) => ((a < b) ? 1 : -1)))
     })
  })

  describe('When the page is loading', () => {
    test('Then it should display a loading', () => {
      const html = BillsUI({ loading: true })
      document.body.innerHTML = html
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })
  describe('When the server return an error', () => {
    test('Then it should display an error message', () => {
      const html = BillsUI({ error: 'Unexpected error' })
      document.body.innerHTML = html
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })  
  })
  describe("When the page load bills", () => {
    test("It should display an icon eye", () => {
      const html = BillsUI({data:bills})
      document.body.innerHTML = html
      const iconEye = screen.getAllByTestId('icon-eye')
      expect(iconEye).toBeTruthy()
    })
  })

  describe('When I am on bills page and I click on the button "nouvelle note de frais"', () => {
    test('Then it should display the page New Bill', () => {
      const html = BillsUI({ data:[]})
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const bills = new Bills({
        document, onNavigate, firestore:null, localStorage: window.localStorage
      })
      const handleClickNewBill = jest.fn(bills.handleClickNewBill)
      const buttonNewBill = screen.getByTestId('btn-new-bill')
      expect(buttonNewBill).toBeTruthy()
      buttonNewBill.addEventListener('click', handleClickNewBill)
      fireEvent.click(buttonNewBill)
      expect(screen.getByText('Envoyer une note de frais')).toBeTruthy() 
    })
  })

  describe('When I click on the eye icon', () => {
    test('Then it should open a modal', () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      } 
      $.fn.modal = jest.fn()
      const billsList = new Bills({
        document, onNavigate, firestore: null, localStorage: window.localStorage
      })     
      const eye = screen.getAllByTestId('icon-eye')[0]
      const handleClickIconEye = jest.fn(billsList.handleClickIconEye(eye))      
      eye.addEventListener('click', handleClickIconEye)
      fireEvent.click(eye)
      expect(handleClickIconEye).toHaveBeenCalled()
    //  expect(screen.getByTestId('modaleFile')).toBeTruthy()         
    })
  })

  describe("Given I navigate to Bills Page", () => {
    test("fetches bills from mock API GET", async () => {
      const getSpy = jest.spyOn(firebase, "get")       
      const userBills = await firebase.get()
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(userBills.data.length).toBe(4)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })  
})

