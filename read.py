from googleapiclient.discovery import build
from google.oauth2 import service_account

#Fontes:
#https://www.youtube.com/watch?v=4ssigWmExak&t=167s
#https://www.youtube.com/watch?v=OZDGVTmQ45Q&t=22s
#https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values

SERVICE_ACCOUNT_FILE = '../keys.json'
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

creds = None
creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)

# The ID and range of a sample spreadsheet.
SAMPLE_SPREADSHEET_ID = '1LSDoA22scyWVJUDlwudKqX0o86w5b-Ds-lGOhRBGYis'  #id do sheets fica entre "d/" e "/edit..."

service = build('sheets', 'v4', credentials=creds)

# Call the Sheets API
#.get lê valores do sheets; .update atualiza/altera valores
sheet = service.spreadsheets()

#result = sheet.values().get(spreadsheetId=SAMPLE_SPREADSHEET_ID,
#                            range="Sheet1!A1:C2").execute() 
#values = result.get('values', [])

#aoa = [["23",0.465],["24",0.579],["25",0.634]]

#request = sheet.values().update(spreadsheetId=SAMPLE_SPREADSHEET_ID, 
#                            range="Sheet1!B2", valueInputOption="USER_ENTERED", body={"values":aoa}).execute() 

#res = sheet.values().clear(spreadsheetId=SAMPLE_SPREADSHEET_ID, range="Sheet1!B2:C4", body=clear_values_request_body).execute()

# Id    time    x   y   z 
data = [["joao@gmail.com",4.5,0.465,0.234,0.642]]
res = sheet.values().append(spreadsheetId=SAMPLE_SPREADSHEET_ID, 
                            range="Sheet1!A1:E1", valueInputOption="USER_ENTERED", 
                            insertDataOption="INSERT_ROWS", body={"values":data}).execute()


print(res)