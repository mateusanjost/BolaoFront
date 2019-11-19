import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User, UserLoginForm } from './user.interface';
//import { Team } from './team.interface';
import { Round } from './round.interface';
import { Game } from './game.interface';
import { Prize } from './prize.interface';
import { Bet } from './bet.interface';
import { Jurisdiction } from './jurisdiction.interface';
import { Contact } from './contact.interface';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  apiUrl = 'http://api.socialawp.com';
  //apiUrl = 'https://localhost:44341';

  constructor(private http: HttpClient) { }
  
  getLogin(log: string, pass: string): Observable<any>{
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    const loginObj = { login: log, password: pass};

    return this.http.post(this.apiUrl + '/users/login', loginObj, { headers: header });

  }

  listUsers(){
    return this.http.get<User[]>(`${this.apiUrl}/users/`);
  }

  getUser(userId: number){
    return this.http.get<User>(`${this.apiUrl}/users/` + userId);
  }

  getUserTree(userId: number){
    return this.http.get<User>(`${this.apiUrl}/common/GetUserTree?userId=`+userId);
  }

  getUsersTreeList(userId: number){
    return this.http.get<User[]>(`${this.apiUrl}/common/GetUsersTreeList?userId=`+userId);
  }

  getJurisdictionsById(jurisdictionId: number){
    return this.http.get<Jurisdiction[]>(`${this.apiUrl}/common/GetJurisdictionsById?jurisdictionId=`+jurisdictionId);
  }

  updateUserCredit(userId: number, credit: number){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });
    
    //return this.http.put<any>(`${this.apiUrl}/common/UpdateCreditTransfer/?userId=`+userId, credit, { headers: header });
    return this.http.put<any>(`${this.apiUrl}/common/UpdateCreditTransfer/?userId=`+userId+'&credit='+credit, { headers: header });
  }

  updateUser(userId: number, user: User){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    let jsonToPass = {
      "Id": user.id,
      "Name": user.name,
      "LastName": user.lastName,
      "Email": user.email,
      "Login": user.login,
      "Password": user.password,
      "Deleted": user.deleted,
      "Commission": user.commission,
      "ParentId": user.parentId,
      "JurisdictionId": user.jurisdictionId,
      "Country": user.country,
      "City": user.city,
      "Credit": user.credit
    }
    
    return this.http.put<User>(this.apiUrl + '/users/'+ userId, jsonToPass, { headers: header });
  }

  /*listTeams(){
    return this.http.get<Team[]>(`${this.apiUrl}/teams/`);
  }*/

  getPrize(){
    return this.http.get<Prize>(`${this.apiUrl}/prizes/`);
  }

  updateJackpot(newJackpot: Prize){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });
    
    // ATTENTION: for now, passing always param 2 because it's jackpot on current prizes table at db
    return this.http.put<Prize>(this.apiUrl + '/prizes/2', newJackpot, { headers: header });
  }

  updateApportionment(newApportionment: Prize){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });
    
    // ATTENTION: for now, passing always param 2 because it's jackpot on current prizes table at db
    return this.http.put<Prize>(this.apiUrl + '/prizes/3', newApportionment, { headers: header });
  }

  getRound(){
    return this.http.get<Round[]>(`${this.apiUrl}/rounds/`);
  }
  
  getLastRound(){
    return this.http.get<Round>(`${this.apiUrl}/common/getlastround`);
  }

  getSpecificRound(roundId: number){
    return this.http.get<Round>(`${this.apiUrl}/rounds/` + roundId);
  }

  createRound(newRound: Round){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    let jsonToPass = { "number" : newRound.number, "startDateTime" : newRound.startDateTime, "endDateTime" : newRound.endDateTime }
    
    return this.http.post<Round>(this.apiUrl + '/rounds/', jsonToPass, { headers: header });
  }

  getBet(betId: number){
    return this.http.get<Bet>(`${this.apiUrl}/bets/` + betId);
  }

  getBets(roundId: number){
    return this.http.get<Bet[]>(`${this.apiUrl}/common/GetActivatedBetsByRound/?roundId=` + roundId);
  }
  
  getAllBets(roundId: number){
    return this.http.get<Bet[]>(`${this.apiUrl}/common/GetBetsByRound/?roundId=` + roundId);
  }

  postBet(bet: any){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    let jsonToPass = {
      "betDate": bet.date,
      "resultBetId": 1,
      "playerId": 1,
      "playerName": bet.playerName,
      "roundId": bet.roundId,
      "userAdminId": bet.userId,
      "results": bet.resultToPass,
      "status": 1
    }

    return this.http.post<Bet>(this.apiUrl + '/bets/', jsonToPass, { headers: header });
  }

  updateBet(bet: Bet){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    let jsonToPass = {
      "id": bet.id,
      "betDate": bet.betDate,
      "resultBetId": bet.resultBetId,
      "playerId": bet.playerId,
      "playerName": bet.playerName,
      "roundId": bet.roundId,
      "userAdminId": bet.userAdminId,
      "results": bet.results
    }

    return this.http.put<Bet>(`${this.apiUrl}/bets/` + bet.id, bet, { headers: header });
  }
  
  getGames(roundId: number){
    return this.http.get<Game[]>(`${this.apiUrl}/common/GetMatchesByRound/?roundId=` + roundId);
  }

  createGame(newGame: Game) {
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    let jsonToPass = { 
      "HomeTeamId" : newGame.homeTeamId,
      "HomeName" : newGame.homeName,
      "AwayTeamId" : newGame.awayTeamId, 
      "AwayName" : newGame.awayName,
      "RoundId" : newGame.roundId, 
      "HomeTeamScore" : 0,
      "AwayTeamScore" : 0,
      "DateTime" : newGame.dateTime
    };
    
    return this.http.post<Game>(this.apiUrl + '/matches/', jsonToPass, { headers: header });
  }

  updateMatches(games: Array<Game>){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    return this.http.put<Game[]>(`${this.apiUrl}/matches/UpdateMatches/`, games, { headers: header });
  }

  listRoundWinners(roundId: number){
    return this.http.get<any[]>(`${this.apiUrl}/common/GetWinnersByRound/?roundId=` + roundId);
  }

  addJurisdiction(newJurisdiction: Jurisdiction){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    return this.http.post<Jurisdiction>(this.apiUrl + '/jurisdictions/', newJurisdiction, { headers: header });
  }

  addNewUser(user: UserLoginForm){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    return this.http.post<Jurisdiction>(`${this.apiUrl}/users/`, user, { headers: header });
  }

  createUser(user: User){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    return this.http.post<User>(`${this.apiUrl}/users/`, user, { headers: header });
  }

  sendPasswordToEmail(name: string, email: string, password: string){
    return this.http.get(`${this.apiUrl}/common/SendPasswordMail/?name=` + name + "&email=" + email + "&password=" + password);
  }
  
  sendRecoveryPassword(email: string){
    return this.http.get(`${this.apiUrl}/common/RecoveryPasswordMail/?email=` + email);
  }

  removeUser(userId: number){
    return this.http.delete<User>(`${this.apiUrl}/users/` + userId);
  }

  /* NOT USED ANY MORE
  sendMessage(contact: any){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/contacts/`, contact, { headers: header });
  }
  */

  sendContactMessage(contact: any){
    const header = new HttpHeaders({
      'Content-type': 'application/json'
    });

    //onsole.log("nome: " + contact.name + " - email: " + contact.email + " - assunto: " + contact.subject + " - msg: " + contact.message);

    return this.http.get(`${this.apiUrl}/common/SendContactMessage/?name=`+contact.name + 
      "&email="+contact.email+"&subject="+contact.subject+"&message="+contact.message, { headers: header });
  }
  
  getUnreadMessages(){    
    return this.http.get<Contact[]>(`${this.apiUrl}/contacts/`);
  }

}
