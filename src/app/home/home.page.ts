import { Component } from '@angular/core';
import { AlertController, ToastController, ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
consultas: any[] = [];
  constructor(
    private alertaControl:AlertController, 
    private toastControl: ToastController,
    private actionSheetControl: ActionSheetController
    ) {// os comandos desta sessão executados durante o load da página
      let consultasJason = localStorage.getItem('tarefaDb');
      //debugger;
      if(consultasJason != null)
      {
        this.consultas = JSON.parse(consultasJason);
      }
    }

  async adicionarConsulta(){
    const alerta = await this.alertaControl.create({
      header:'Agendar Consultas!',
      inputs: [
        {name: 'nome', type: 'text', placeholder: 'Seu Nome:'},
        {name: 'medico', type: 'text', placeholder: 'Especialidade:'},
        {name: 'data', type: 'date', placeholder: 'Qual a data ?'},
        {name: 'horario', type: 'time', placeholder: 'Qual o Horário ?'},

      ],
      buttons: [
        {text: 'Cancelar', role: 'cancel', cssClass: "primary", 
        handler: ()=>{
          // caso o usuário clique em cancelar???
          console.log('Acho que você clicou em cancelar?');
        }}

        ,{
          text: 'Ok', 
          handler: (form) =>{
            //debugger;
            this.addConsulta(form);
          }
        }]
    });
    await alerta.present();
  }
  async addConsulta(dadosform: any[]) {
    //verifica se o usuário digitou uma tarefa

  if (dadosform.length < 1){
    const toast = await this.toastControl.create({
      message: 'Informe o que precisa fazer',
      duration: 2000,
      position: 'middle',
      color: 'primary'
    });
    toast.present();
    return;
  }
  let consulta = { nome: dadosform.nome,
                   medicos: dadosform.medico, 
                   datas: dadosform.data, 
                   horas: dadosform.horario, 
                   feito: false, 
                   mostrar: false};
  //debugger;
  this.consultas.push(consulta);
  this.updateLocalStorage();
}//final do método addTarefa <<<<<<<<<<<<<<



updateLocalStorage(){
  localStorage.setItem('tarefaDb',JSON.stringify(this.consultas));
}

excluir(consultinha: any){
  this.consultas = this.consultas.filter(a => consultinha != a); //empressão Lambda
  this.updateLocalStorage();
}


async abrirAcoes(consultinha:any){    
  const actionsheet = await this.actionSheetControl.create({
      header: "O que deseja fazer?",
      buttons: [{        
      text: consultinha.feito ? 'Desmarcar' : 'Marcar',       
      icon: consultinha.feito ? 'radio-button-off' : 'checkmark-circle',
      handler:()=>{          consultinha.feito = !consultinha.feito; // inverte o valor de task  
      this.updateLocalStorage();       
     }       
    },     
    
    {      
     text: 'Cancelar',       
     icon: 'close',       
     role: 'cancel',      
     handler: () => {         
      console.log('clicou em cancelar');
     }     
    }    
   ]    
  });    
  await actionsheet.present();// ecexutar a actionsheet  
}// final do actionsheet

}


