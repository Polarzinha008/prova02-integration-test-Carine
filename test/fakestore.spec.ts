import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';

describe('FakeStore API', () => {
  const p = pactum;
  const baseUrl = 'https://fakestoreapi.com';

  beforeAll(() => {
    console.log('🚀 Iniciando testes da FakeStore API...');
    p.reporter.add(SimpleReporter);
  });

  // =========================
  // PRODUCTS
  // =========================
  describe('Products', () => {

    it('GET - Listar produtos', async () => {
      console.log('\n🔍 [TESTE] Listar produtos');

      const res = await p
        .spec()
        .get(`${baseUrl}/products`)
        .expectStatus(200)
        .returns('res.body');

      console.log('📦 Total de produtos:', res.length);
      console.log('📦 Primeiro produto:', res[0]);
    });

    it('GET - Produto por ID', async () => {
      console.log('\n🔍 [TESTE] Buscar produto por ID');

      const res = await p
        .spec()
        .get(`${baseUrl}/products/1`)
        .expectStatus(200)
        .returns('res.body');

      console.log('📦 Produto recebido:', res);
    });

    it('POST - Criar produto', async () => {
      console.log('\n🧪 [TESTE] Criar produto');

      const payload = {
        title: 'Produto Teste',
        price: 99.99,
        description: 'Teste',
        image: 'https://i.pravatar.cc',
        category: 'electronics'
      };

      console.log('📤 Enviando payload:', payload);

      const res = await p
        .spec()
        .post(`${baseUrl}/products`)
        .withJson(payload)
        .expectStatus(201) // ✅ CORRETO
        .returns('res.body');

      console.log('📥 Resposta da API:', res);
    });

  });

  // =========================
  // CARTS
  // =========================
  describe('Carts', () => {

    it('GET - Listar carrinhos', async () => {
      console.log('\n🔍 [TESTE] Listar carrinhos');

      const res = await p
        .spec()
        .get(`${baseUrl}/carts`)
        .expectStatus(200)
        .returns('res.body');

      console.log('📦 Total de carrinhos:', res.length);
      console.log('📦 Primeiro carrinho:', res[0]);
    });

    it('POST - Criar carrinho', async () => {
      console.log('\n🧪 [TESTE] Criar carrinho');

      const payload = {
        userId: 1,
        date: '2026-04-22',
        products: [{ productId: 1, quantity: 1 }]
      };

      console.log('📤 Enviando payload:', payload);

      const res = await p
        .spec()
        .post(`${baseUrl}/carts`)
        .withJson(payload)
        .expectStatus(201) // ✅ CORRETO
        .returns('res.body');

      console.log('📥 Resposta da API:', res);
    });

  });

  // =========================
  // USERS
  // =========================
  describe('Users', () => {

    it('GET - Listar usuários', async () => {
      console.log('\n🔍 [TESTE] Listar usuários');

      const res = await p
        .spec()
        .get(`${baseUrl}/users`)
        .expectStatus(200)
        .returns('res.body');

      console.log('📦 Total de usuários:', res.length);
      console.log('📦 Primeiro usuário:', res[0]);
    });

  });

});