import { BrowserRouter, Switch, Route } from "react-router-dom";
import { CarrinhoProvider } from "common/context/Carrinho";
import { UsuarioProvider } from "common/context/Usuario";

import Carrinho from "pages/Carrinho";
import Feira from "pages/Feira";
import Login from "pages/Login";
import { PagamentoProvider } from "common/context/Pagamento";

const Router = () => {
  return (
    <BrowserRouter>
      <Switch>
        <UsuarioProvider>
          <Route exact path="/">
            <Login />
          </Route>
          <CarrinhoProvider>
            <PagamentoProvider>
              <Route path="/feira">
                <Feira />
              </Route>
              <Route path="/carrinho">
                <Carrinho />
              </Route>
            </PagamentoProvider>
          </CarrinhoProvider>
        </UsuarioProvider>
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
