#Como fizemos?

1rt -> Fizemos a criacao de uma rota publica para mostra que nosso sistema esta funcionando.
2nd -> Criamos uma rota de cadastro de usuario no sistema
  * usando bcrypt para a senha,criando um hash p n deixar a senha crua
  * realizamos varias validacoes para proteger os dados enviados para o sistema(podendo ter mais validacoes)
3rd -> Criamos uma rota de login que entrega o token para o usuario, batendo o email e a senha dele no sistema
  => n cria a sessao, Seu trabalho e so dizer que o usuario logado e o usuario mesmo (de autenticacao, so da o ok)(entrega o token pra ele).
  => O trabalho de permissao e feito via token

4th -> Criamos uma rota privado que pega um usuario de sistema
  * A ideia foi mais testar o tOKEN pelo middleware, ele impede que o usuario envie um requisicao sem token, dando acesso negado, ou que me envie um token modificado, algo tentando hackear o nosso sistema, via token vazio ou via token errado, invalidamos isso aqui. E se estiver certo, pod eprossegui (NEXT), ou seja, toda rota que precisa ser protejida tera esse middleware "checkToken" para proteger a rota, limitando quem acessa recursos do nosso sistema.