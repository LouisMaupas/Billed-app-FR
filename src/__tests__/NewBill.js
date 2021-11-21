import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES, ROUTES_PATH } from '../constants/routes.js'
import firebase from "../__mocks__/firebase"


// test d'intégration POST
describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page, and I create a new bill", () => {
    test("Then it should POST a bill", async () => {
      const postSpy = jest.spyOn(firebase, "post")
      const newBill = {
        "id": "47qAXb6fIm2zOKkLzMro",
        "vat": "80",
        "fileUrl": "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
        "status": "pending",
        "type": "Hôtel et logement",
        "commentary": "séminaire billed",
        "name": "encore",
        "fileName": "preview-facture-free-201801-pdf-1.jpg",
        "date": "2004-04-04",
        "amount": 400,
        "commentAdmin": "ok",
        "email": "a@a",
        "pct": 20
      }
      const bills = await firebase.post(newBill)
      expect(postSpy).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(5)
    })
  })
})

// Test a NewBill
describe("Given I am connected as an employee", () => {
  describe("When I upload a supporting file", () => {
    test("Then it should have been uploaded", () => {
      Object.defineProperty(window, 'localStorage', {value: localStorage})
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES ({pathname})
      }
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document, onNavigate, firestore: null, localStorage: window.localStorage
      })
      // https://jestjs.io/docs/mock-functions#using-a-mock-function
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const input = screen.getByTestId("file")
      input.addEventListener('change', handleChangeFile)
      fireEvent.change(input, {
        target: {
          files: [new File(["bill.png"], "bill.png", { type: "image/png" })]
        }
      })
      expect(handleChangeFile).toHaveBeenCalled();      
      expect(input.files[0].name).toBe("bill.png");
    })
  })

  describe("When I submit a bill but the file haven't a good extension", () => {
    test("It should not submit the form", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document, onNavigate, firestore: null, localStorage: window.localStorage
      })
      const handleSubmit = jest.fn(newBill.handleSubmit)
      newBill.fileName = 'invalid'
      const newBillform = screen.getByTestId("form-new-bill")
      newBillform.addEventListener('submit', handleSubmit)
      fireEvent.submit(newBillform)
      expect(handleSubmit).toHaveBeenCalled()
      expect(screen.getByText('Envoyer une note de frais')).toBeTruthy() 
    })
  })

  describe("When I submit a bill with a a good extension", () => {
    test("It should create a new bill", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document, onNavigate, firestore: null, localStorage: window.localStorage
      })
      const handleSubmit = jest.fn(newBill.handleSubmit)
      const newBillform = screen.getByTestId("form-new-bill")
      newBillform.addEventListener('submit', handleSubmit)
      fireEvent.submit(newBillform)
      expect(handleSubmit).toHaveBeenCalled()
    })
  })

})