import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {
  private apiKey     : string   = 'kNTnsKbNwyMU8vI0Ut5tB9jz7BNuOPXk';
  private servicioUrl: string   = 'https://api.giphy.com/v1/gifs';
  private _historial : string[] = [];

  public resultados: Gif[] = [];

  get historial(){
    return [...this._historial];
  }

  constructor(private http: HttpClient){
    this._historial = JSON.parse(localStorage.getItem('historial')!) ||  [];
  
    //Se cargan los últimos resultados de la última búsqueda
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) ||  []; 
  
  }
  
  buscarGifs(query: string = ''){
    query = query.trim().toLowerCase();

    if(!this.historial.includes(query)){
      this._historial.unshift(query); 
      this._historial = this._historial.splice(0,10);
      
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }
    
    const params = new HttpParams()
          .set('api_key', this.apiKey)
          .set('limit', '10')
          .set('q', query);
    
    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`,{params})
    .subscribe( (resp) => {
      this.resultados = resp.data;
      //Se almacena en el local storage los últimos resultados como historial
      localStorage.setItem('resultados', JSON.stringify(this.resultados ));
    });
  }
}
