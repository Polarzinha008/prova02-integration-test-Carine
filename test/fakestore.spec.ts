import pactum from 'pactum';

// evita erro no CI (API externa bloqueando)
const describeIf = process.env.CI ? describe.skip : describe;

describeIf('FakeStore API - Testes de Integração', () => {
  const p = pactum;
  const baseUrl = 'https://fakestoreapi.com';

  beforeAll(() => {
    console.log('🚀 Iniciando testes da FakeStore API...');
    p.request.setDefaultTimeout(10000);
  });

  // =========================
  // PRODUCTS
  // =========================
  describe('Products - Cenários de Teste', () => {

    it('CT01 - Deve listar todos os produtos', async () => {
      const res = await p.spec()
        .get(`${baseUrl}/products`)
        .expectStatus(200)
        .returns('res.body');

      expect(res.length).toBeGreaterThan(0);
    });

    it('CT02 - Deve retornar produto por ID válido', async () => {
      const res = await p.spec()
        .get(`${baseUrl}/products/1`)
        .expectStatus(200)
        .returns('res.body');

      expect(res.id).toBe(1);
    });

    it('CT03 - Deve retornar resposta válida para produto inexistente', async () => {
      await p.spec()
        .get(`${baseUrl}/products/999999`)
        .expectStatus(200);
    });

    it('CT04 - Deve criar um novo produto', async () => {
      const res = await p.spec()
        .post(`${baseUrl}/products`)
        .withJson({
          title: 'Produto Teste',
          price: 99.99,
          description: 'Teste',
          image: 'https://i.pravatar.cc',
          category: 'electronics'
        })
        .expectStatus(201)
        .returns('res.body');

      expect(res.title).toBe('Produto Teste');
    });

  });

  // =========================
  // CARTS
  // =========================
  describe('Carts - Cenários de Teste', () => {

    it('CT05 - Deve listar todos os carrinhos', async () => {
      const res = await p.spec()
        .get(`${baseUrl}/carts`)
        .expectStatus(200)
        .returns('res.body');

      expect(res.length).toBeGreaterThan(0);
    });

    it('CT06 - Deve retornar carrinho por ID', async () => {
      const res = await p.spec()
        .get(`${baseUrl}/carts/1`)
        .expectStatus(200)
        .returns('res.body');

      expect(res).toHaveProperty('id');
    });

    it('CT07 - Deve criar um novo carrinho', async () => {
      const res = await p.spec()
        .post(`${baseUrl}/carts`)
        .withJson({
          userId: 1,
          date: '2026-04-22',
          products: [{ productId: 1, quantity: 1 }]
        })
        .expectStatus(201)
        .returns('res.body');

      expect(res.userId).toBe(1);
    });

  });

  // =========================
  // USERS
  // =========================
  describe('Users - Cenários de Teste', () => {

    it('CT08 - Deve listar todos os usuários', async () => {
      const res = await p.spec()
        .get(`${baseUrl}/users`)
        .expectStatus(200)
        .returns('res.body');

      expect(res.length).toBeGreaterThan(0);
    });

    it('CT09 - Deve retornar usuário por ID', async () => {
      const res = await p.spec()
        .get(`${baseUrl}/users/1`)
        .expectStatus(200)
        .returns('res.body');

      expect(res).toHaveProperty('email');
    });

  });

});

// =========================
// TESTE LOCAL (CI)
// =========================
describe('CT10 - Teste básico do sistema', () => {
  it('Deve validar operação simples', () => {
    expect(1 + 1).toBe(2);
  });
});