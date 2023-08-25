import { createContext, useContext, useEffect, useState } from "react";
import { usePagamentoContext } from "./Pagamento";
import { UsuarioContext } from "./Usuario";

export const CarrinhoContext = createContext();

CarrinhoContext.displayName = "Carrinho";

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);

  const [quantidadeProdutos, setQuantidadeProdutos] = useState(0);

  const [valorTotalCarrinho, setValorTotalCarrinho] = useState(0);

  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        setCarrinho,
        quantidadeProdutos,
        setQuantidadeProdutos,
        valorTotalCarrinho,
        setValorTotalCarrinho,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinhoContext = () => {
  const {
    carrinho,
    setCarrinho,
    quantidadeProdutos,
    setQuantidadeProdutos,
    valorTotalCarrinho,
    setValorTotalCarrinho,
  } = useContext(CarrinhoContext);

  const { formaPagamento } = usePagamentoContext();
  const { saldo, setSaldo } = useContext(UsuarioContext);

  const mudarQuantidade = (id, quantidade) => {
    return carrinho.map((item) => {
      if (item.id === id) {
        item.quantidade += quantidade;
      }

      return item;
    });
  };

  const adicionarProduto = (novoProduto) => {
    const temOProduto = carrinho.some((item) => item.id === novoProduto.id);

    if (!temOProduto) {
      novoProduto.quantidade = 1;
      return setCarrinho((carrinhoAnterior) => [
        ...carrinhoAnterior,
        novoProduto,
      ]);
    }

    setCarrinho(mudarQuantidade(novoProduto.id, 1));
  };

  const removerProduto = (id) => {
    const produto = carrinho.find((item) => item.id === id);
    const ultimoProduto = produto.quantidade === 1;

    if (ultimoProduto) {
      return setCarrinho((carrinhoAnterior) =>
        carrinhoAnterior.filter((item) => item.id !== id)
      );
    }

    setCarrinho(mudarQuantidade(id, -1));
  };

  const efetuarComprar = () => {
    setCarrinho([]);
    setSaldo(saldoAtual => saldoAtual - valorTotalCarrinho);
  };

  useEffect(() => {
    const { novaQuantidade, novoTotal } = carrinho.reduce(
      (contador, produto) => ({
        novaQuantidade: contador.novaQuantidade + produto.quantidade,
        novoTotal: contador.novoTotal + produto.quantidade * produto.valor,
      }),
      {
        novaQuantidade: 0,
        novoTotal: 0,
      }
    );

    setQuantidadeProdutos(novaQuantidade);
    setValorTotalCarrinho(novoTotal * formaPagamento.juros);
  }, [carrinho, setQuantidadeProdutos, setValorTotalCarrinho, formaPagamento]);

  return {
    carrinho,
    setCarrinho,
    quantidadeProdutos,
    setQuantidadeProdutos,
    valorTotalCarrinho,
    adicionarProduto,
    removerProduto,
    efetuarComprar
  };
};
