import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';

describe('FakeStore API', () => {
  const p = pactum;
  const baseUrl = 'https://fakestoreapi.com';

  beforeAll(() => {
    console.log('🚀 Iniciando testes da FakeStore API...');
    p.request.setDefaultTimeout(10000); // ✅ evita erro no CI
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

      expect(res.length).toBeGreaterThan(0); // ✅ cobertura
      expect(res[0]).toHaveProperty('id');   // ✅ cobertura
    });

    it('GET - Produto por ID', async () => {
      console.log('\n🔍 [TESTE] Buscar produto por ID');

      const res = await p
        .spec()
        .get(`${baseUrl}/products/1`)
        .expectStatus(200)
        .returns('res.body');

      console.log('📦 Produto recebido:', res);

      expect(res.id).toBe(1);
      expect(res).toHaveProperty('title');
      expect(res).toHaveProperty('price');
    });

    it('GET - Produto inexistente (erro)', async () => {
      console.log('\n⚠️ [TESTE] Produto inexistente');

      await p
        .spec()
        .get(`${baseUrl}/products/999999`)
        .expectStatus(404); // ✅ cobre cenário de erro
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

      const res = await p
        .spec()
        .post(`${baseUrl}/products`)
        .withJson(payload)
        .expectStatus(201)
        .returns('res.body');

      console.log('📥 Resposta da API:', res);

      expect(res.title).toBe(payload.title);
      expect(res).toHaveProperty('id');
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

      expect(res.length).toBeGreaterThan(0);
      expect(res[0]).toHaveProperty('id');
    });

    it('POST - Criar carrinho', async () => {
      console.log('\n🧪 [TESTE] Criar carrinho');

      const payload = {
        userId: 1,
        date: '2026-04-22',
        products: [{ productId: 1, quantity: 1 }]
      };

      const res = await p
        .spec()
        .post(`${baseUrl}/carts`)
        .withJson(payload)
        .expectStatus(201)
        .returns('res.body');

      console.log('📥 Resposta da API:', res);

      expect(res.userId).toBe(payload.userId);
      expect(res.products.length).toBeGreaterThan(0);
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

      expect(res.length).toBeGreaterThan(0);
      expect(res[0]).toHaveProperty('email');
    });

  });

});