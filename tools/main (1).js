// =====================================================
// Mon Ami — Main JS
// Tab-based lazy loading + unique Unsplash photos
// =====================================================

// ── Unsplash photo map (unique per product) ──────────
const PRODUCT_PHOTOS = {
  // ЗАВТРАКИ
  "prod-breakfast-001": "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=400&q=70", // венские вафли
  "prod-breakfast-002": "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=70", // французские тосты
  "prod-breakfast-003": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=70", // завтрак монами (полный)
  "prod-breakfast-004": "https://images.unsplash.com/photo-1517673408408-e75dea78ef89?w=400&q=70", // гранола с йогуртом
  "prod-breakfast-005": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=70", // крок-мадам
  "prod-breakfast-006": "https://images.unsplash.com/photo-1614961909577-c5f8b3d5a83c?w=400&q=70", // овсяная каша
  "prod-breakfast-007": "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=400&q=70", // креп сюзет
  "prod-breakfast-008": "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=400&q=70", // рисовая каша
  "prod-breakfast-009": "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&q=70", // сырники
  "prod-breakfast-010": "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&q=70", // тартин с ветчиной
  "prod-breakfast-011": "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&q=70", // круассан бенедикт
  "prod-breakfast-012": "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=70", // тартин с авокадо
  "prod-breakfast-013": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=70", // датский завтрак
  "prod-breakfast-014": "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=70", // английский завтрак
  "prod-breakfast-015": "https://images.unsplash.com/photo-1536510233921-8e9c8a81b6e5?w=400&q=70", // омлет со спаржей

  // ЗАКУСКИ
  "prod-appetizers-001": "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=70", // вителло тоннато
  "prod-appetizers-002": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=70", // темпура
  "prod-appetizers-003": "https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&q=70", // мидии
  "prod-appetizers-004": "https://images.unsplash.com/photo-1572453800999-e8d2d1589b7c?w=400&q=70", // рататуй с бурратой

  // СУПЫ
  "prod-soups-001": "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=70", // грибной крем суп
  "prod-soups-002": "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&q=70", // батат суп
  "prod-soups-003": "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=400&q=70", // холодный томатный
  "prod-soups-004": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&q=70", // куриный с вонтонами
  "prod-soups-005": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=70", // биск
  "prod-soups-006": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&q=70", // том ям
  "prod-soups-007": "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=70", // куриный домашний

  // САЛАТЫ
  "prod-salads-001": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=70", // нисуаз
  "prod-salads-002": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=70", // зелёный салат
  "prod-salads-003": "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400&q=70", // томаты с моцареллой
  "prod-salads-004": "https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=400&q=70", // ростбиф со свёклой
  "prod-salads-005": "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&q=70", // салат с цыплёнком
  "prod-salads-006": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=70", // салат с песто
  "prod-salads-007": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=70", // с креветками и авокадо
  "prod-salads-008": "https://images.unsplash.com/photo-1485963631004-f2f00b1d6606?w=400&q=70", // с форелью и авокадо

  // БУРГЕРЫ
  "prod-burgers-001": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=70", // бургер с говядиной
  "prod-burgers-002": "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400&q=70", // чиабатта с курицей
  "prod-burgers-003": "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&q=70", // круассан с курицей
  "prod-burgers-004": "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=70", // бургер классический
  "prod-burgers-005": "https://images.unsplash.com/photo-1516559828984-fb3b99548b21?w=400&q=70", // чиабатта с форелью
  "prod-burgers-006": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=70", // круассан с форелью

  // ПИЦЦА
  "prod-pizza-001": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&q=70", // маргарита
  "prod-pizza-002": "https://images.unsplash.com/photo-1548369937-47519962c11a?w=400&q=70", // 4 сыра
  "prod-pizza-003": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&q=70", // грибной жульен
  "prod-pizza-004": "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&q=70", // груша и дорблю
  "prod-pizza-005": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=70", // с форелью
  "prod-pizza-006": "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&q=70", // пепперони
  "prod-pizza-007": "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=400&q=70", // диабло
  "prod-pizza-008": "https://images.unsplash.com/photo-1539136788836-5699e78bfc75?w=400&q=70", // мясная

  // ПАСТА
  "prod-pasta-001": "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=400&q=70", // фетучини с сёмгой
  "prod-pasta-002": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&q=70", // фетучини с грибами и курицей
  "prod-pasta-003": "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=70", // спагетти путанеска
  "prod-pasta-004": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=70", // ригатони со страчателлой
  "prod-pasta-005": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400&q=70", // равиоли с рикотой

  // ВТОРЫЕ БЛЮДА
  "prod-main-001": "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=70", // цыплёнок с цукини
  "prod-main-002": "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=70", // беф бургуньон
  "prod-main-003": "https://images.unsplash.com/photo-1432139509613-5c4255815697?w=400&q=70", // ягнёнок с чечевицей
  "prod-main-004": "https://images.unsplash.com/photo-1585325701956-60dd9c8399b6?w=400&q=70", // шницель из курицы
  "prod-main-005": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&q=70", // сибас
  "prod-main-006": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=70", // стейк из форели
  "prod-main-007": "https://images.unsplash.com/photo-1598515213692-b9a66f82e0ec?w=400&q=70", // куриное бедро с картофелем

  // ГОРЯЧИЕ (СТЕЙКИ)
  "prod-steaks-001": "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=70", // рибай
  "prod-steaks-002": "https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=70", // тибон
  "prod-steaks-003": "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&q=70", // нью йорк
  "prod-steaks-004": "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=400&q=70", // томагавк
  "prod-steaks-005": "https://images.unsplash.com/photo-1504973960431-1c467e159aa4?w=400&q=70", // вырезка телёнка

  // ГАРНИРЫ
  "prod-side-001": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=70", // фри
  "prod-side-002": "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=400&q=70", // картофельные дольки
  "prod-side-003": "https://images.unsplash.com/photo-1603088549155-e8753c0f0f7c?w=400&q=70", // пюре
  "prod-side-004": "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&q=70", // рис

  // ВЫПЕЧКА
  "prod-bakery-001": "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&q=70", // тартин
  "prod-bakery-002": "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400&q=70", // тартин ржаной
  "prod-bakery-003": "https://images.unsplash.com/photo-1600775508114-5e9d4b4a4c59?w=400&q=70", // бородинский
  "prod-bakery-004": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=70", // чиабатта
  "prod-bakery-005": "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400&q=70", // багет
  "prod-bakery-006": "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=70", // бриошь
  "prod-bakery-007": "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400&q=70", // хлебная корзина

  // КУКИСЫ
  "prod-cookies-001": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=70", // смородиновый
  "prod-cookies-002": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&q=70", // розмарин мята
  "prod-cookies-003": "https://images.unsplash.com/photo-1515213338840-bd8e0b61b49a?w=400&q=70", // классический шоколад
  "prod-cookies-004": "https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=400&q=70", // шоколадный с кремчизом
  "prod-cookies-005": "https://images.unsplash.com/photo-1548365328-8c6db3220e4d?w=400&q=70", // шоколадно-ореховый
  "prod-cookies-006": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400&q=70", // сникерс

  // ДЕСЕРТЫ
  "prod-desserts-001": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=70", // золотая карамелька
  "prod-desserts-002": "https://images.unsplash.com/photo-1488477304112-4944851de03d?w=400&q=70", // грушевый дзен
  "prod-desserts-003": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&q=70", // ройал
  "prod-desserts-004": "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=400&q=70", // малиновый шарм
  "prod-desserts-005": "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&q=70", // финик-фисташка
  "prod-desserts-006": "https://images.unsplash.com/photo-1519915028121-7d3463d5b1ff?w=400&q=70", // лимонная тарталетка
  "prod-desserts-007": "https://images.unsplash.com/photo-1491483894040-66c814498c0b?w=400&q=70", // экзотический шарм
  "prod-desserts-008": "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&q=70", // ягодный шу
  "prod-desserts-009": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=70", // облепиховый шарм
  "prod-desserts-010": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=70", // кофе-талкан
  "prod-desserts-011": "https://images.unsplash.com/photo-1612203985729-70726954388c?w=400&q=70", // эклер тирамису

  // СОУСЫ И ДОБАВКИ
  "prod-sauces-001": "https://images.unsplash.com/photo-1585325701492-4bef0ef9b34f?w=400&q=70", // барбекю
  "prod-sauces-002": "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400&q=70", // сальса
  "prod-sauces-003": "https://images.unsplash.com/photo-1587048555770-49c6f88bc2f4?w=400&q=70", // сметана
  "prod-sauces-004": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=70", // сливочное масло
  "prod-sauces-005": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=70", // оливковое масло
  "prod-sauces-006": "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?w=400&q=70", // авокадо
  "prod-sauces-007": "https://images.unsplash.com/photo-1546093385-3ee2ca2b5f73?w=400&q=70", // томат
  "prod-sauces-008": "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&q=70", // огурцы
  "prod-sauces-009": "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400&q=70", // халапеньо
  "prod-sauces-010": "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=400&q=70", // кетчуп
  "prod-sauces-011": "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=70", // табаско
  "prod-sauces-012": "https://images.unsplash.com/photo-1569288052389-dac9b0ac9eac?w=400&q=70", // яйца

  // НАПИТКИ ОТ БАРИСТА
  "prod-barista-001": "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=70", // матча латте
  "prod-barista-002": "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&q=70", // розовая матча
  "prod-barista-003": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70", // голубая матча
  "prod-barista-004": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=70", // матча жасмин маракуйя
  "prod-barista-005": "https://images.unsplash.com/photo-1572490122747-3e9197aa8a8e?w=400&q=70", // дальгона манго
  "prod-barista-006": "https://images.unsplash.com/photo-1571066811602-716837d681de?w=400&q=70", // имбирный разряд
  "prod-barista-007": "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=70", // маккао
  "prod-barista-008": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=70", // аффогато
  "prod-barista-009": "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&q=70", // таро латте
  "prod-barista-010": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=70", // гранатовый бамбл
  "prod-barista-011": "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&q=70", // грейпфрут лайм бамбл
  "prod-barista-012": "https://images.unsplash.com/photo-1638613555670-a5c7b3ece019?w=400&q=70", // ананасовый бамбл
  "prod-barista-013": "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=70", // апельсиновый бамбл
  "prod-barista-014": "https://images.unsplash.com/photo-1551030173-122aabc4489c?w=400&q=70", // эспрессо тоник классический
  "prod-barista-015": "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&q=70", // эспрессо тоник вишня
  "prod-barista-016": "https://images.unsplash.com/photo-1523371054106-bbf80586c54b?w=400&q=70", // эспрессо тоник гранат малина
  "prod-barista-017": "https://images.unsplash.com/photo-1540189549336-e6e99eb4b8db?w=400&q=70", // эспрессо тоник манго лайм
  "prod-barista-018": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=70", // эспрессо тоник гибискус
  "prod-barista-019": "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400&q=70", // эспрессо тоник морковь

  // КОФЕ
  "prod-coffee-001": "https://images.unsplash.com/photo-1573543784737-9ce2f6d3e5db?w=400&q=70", // капучино 250
  "prod-coffee-002": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=70", // капучино 400
  "prod-coffee-003": "https://images.unsplash.com/photo-1532004491497-ba35c367d634?w=400&q=70", // американо 250
  "prod-coffee-004": "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=70", // американо 400
  "prod-coffee-005": "https://images.unsplash.com/photo-1534040385115-33dcb3acba5b?w=400&q=70", // флэт уайт
  "prod-coffee-006": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=70", // колд брю
  "prod-coffee-007": "https://images.unsplash.com/photo-1589871973318-9ca1258faa5d?w=400&q=70", // латте
  "prod-coffee-008": "https://images.unsplash.com/photo-1485808191679-5f86510bd652?w=400&q=70", // маккиато
  "prod-coffee-009": "https://images.unsplash.com/photo-1551030173-122aabc4489c?w=400&q=70", // раф кофе
  "prod-coffee-010": "https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400&q=70", // шоты бодрости
  "prod-coffee-011": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=70", // витаминный шот

  // ЧАИ
  "prod-tea-001": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=70", // облепиховый розмарин
  "prod-tea-002": "https://images.unsplash.com/photo-1597481499750-3e6b22637536?w=400&q=70", // ягодный с пряностями
  "prod-tea-003": "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&q=70", // ананас с вишней
  "prod-tea-004": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=70", // малиновый
  "prod-tea-005": "https://images.unsplash.com/photo-1571066811602-716837d681de?w=400&q=70", // имбирный с гранатом
  "prod-tea-006": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=70", // чай ассам
  "prod-tea-007": "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=70", // зелёный цейлонский
  "prod-tea-008": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70", // ташкентский с наватом
  "prod-tea-009": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=70", // травяной успокаивающий
  "prod-tea-010": "https://images.unsplash.com/photo-1597481499666-67de784ec97d?w=400&q=70", // анчан чай горячий
  "prod-tea-011": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=70", // те гуань инь горячий
  "prod-tea-012": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=70", // шу пуэр
  "prod-tea-013": "https://images.unsplash.com/photo-1571066811602-716837d681de?w=400&q=70", // кокосовый чай
  "prod-tea-014": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=70", // карак чай
  "prod-tea-015": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=70", // травяной фиточай

  // ХОЛОДНЫЕ ЧАИ
  "prod-cold-tea-001": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=70", // персик клубника
  "prod-cold-tea-002": "https://images.unsplash.com/photo-1597481499666-67de784ec97d?w=400&q=70", // каркадэ холодный
  "prod-cold-tea-003": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=70", // жасминовый с манго
  "prod-cold-tea-004": "https://images.unsplash.com/photo-1571066811602-716837d681de?w=400&q=70", // анчан холодный
  "prod-cold-tea-005": "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=70", // те гуань инь холодный
  "prod-cold-tea-006": "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&q=70", // ромашковый с личи

  // ЛИМОНАДЫ
  "prod-lemonades-001": "https://images.unsplash.com/photo-1538391429703-8dc1e2c97b6e?w=400&q=70", // бузина клубника 300
  "prod-lemonades-002": "https://images.unsplash.com/photo-1570696516188-ade861b84a49?w=400&q=70", // бузина клубника 1л
  "prod-lemonades-003": "https://images.unsplash.com/photo-1546171753-97d7676e4602?w=400&q=70", // манго маракуйя 300
  "prod-lemonades-004": "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&q=70", // манго маракуйя 1л
  "prod-lemonades-005": "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&q=70", // грейпфрут личи 300
  "prod-lemonades-006": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=70", // грейпфрут личи 1л
  "prod-lemonades-007": "https://images.unsplash.com/photo-1637018219847-1fd2f94c9e65?w=400&q=70", // щавель ананас 300
  "prod-lemonades-008": "https://images.unsplash.com/photo-1638613555670-a5c7b3ece019?w=400&q=70", // щавель ананас 1л
  "prod-lemonades-009": "https://images.unsplash.com/photo-1523371054106-bbf80586c54b?w=400&q=70", // агава юдзу 300
  "prod-lemonades-010": "https://images.unsplash.com/photo-1540189549336-e6e99eb4b8db?w=400&q=70", // агава юдзу 1л
  "prod-lemonades-011": "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=400&q=70", // мохито 300
  "prod-lemonades-012": "https://images.unsplash.com/photo-1527459253451-0dfc1b3f8133?w=400&q=70", // мохито 1л
  "prod-lemonades-013": "https://images.unsplash.com/photo-1596803244897-18cc27c4b0ba?w=400&q=70", // ягодный 300
  "prod-lemonades-014": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=70", // ягодный 1л
  "prod-lemonades-015": "https://images.unsplash.com/photo-1560508179-b2c9a3f8e92b?w=400&q=70", // манго ананас 300
  "prod-lemonades-016": "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400&q=70", // манго ананас 1л
  "prod-lemonades-017": "https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400&q=70", // киви яблоко 300
  "prod-lemonades-018": "https://images.unsplash.com/photo-1506802913710-00d6b5d49d8b?w=400&q=70", // киви яблоко 1л
  "prod-lemonades-019": "https://images.unsplash.com/photo-1605405748313-a416a1b84491?w=400&q=70", // огуречный алоэ 300
  "prod-lemonades-020": "https://images.unsplash.com/photo-1571066811602-716837d681de?w=400&q=70", // огуречный алоэ 1л

  // БЕЗАЛКОГОЛЬНЫЕ КОКТЕЙЛИ
  "prod-cocktails-001": "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&q=70", // silk matcha cloud
  "prod-cocktails-002": "https://images.unsplash.com/photo-1523371054106-bbf80586c54b?w=400&q=70", // апероль шприц
  "prod-cocktails-003": "https://images.unsplash.com/photo-1596803244897-18cc27c4b0ba?w=400&q=70", // крем де кассис
  "prod-cocktails-004": "https://images.unsplash.com/photo-1560508179-b2c9a3f8e92b?w=400&q=70", // пина колада
  "prod-cocktails-005": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=70", // беллини уайт

  // ФРЕШИ И СМУЗИ
  "prod-fresh-001": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=70", // апельсиновый
  "prod-fresh-002": "https://images.unsplash.com/photo-1576009930228-0f31ffeb7b0f?w=400&q=70", // яблочный
  "prod-fresh-003": "https://images.unsplash.com/photo-1605405748313-a416a1b84491?w=400&q=70", // сельдерей огурец
  "prod-fresh-004": "https://images.unsplash.com/photo-1603569283847-aa295f0d016a?w=400&q=70", // морковный
  "prod-fresh-005": "https://images.unsplash.com/photo-1546171753-97d7676e4602?w=400&q=70", // манго саго
  "prod-fresh-006": "https://images.unsplash.com/photo-1638613555670-a5c7b3ece019?w=400&q=70", // тропический
  "prod-fresh-007": "https://images.unsplash.com/photo-1637018219847-1fd2f94c9e65?w=400&q=70", // зелёный сад
  "prod-fresh-008": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=70", // клубника вишня
  "prod-fresh-009": "https://images.unsplash.com/photo-1506802913710-00d6b5d49d8b?w=400&q=70", // какао вишня сакура
  "prod-fresh-010": "https://images.unsplash.com/photo-1596803244897-18cc27c4b0ba?w=400&q=70", // красный бархат
  "prod-fresh-011": "https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400&q=70", // авокадо драйв

  // МОЛОЧНЫЕ КОКТЕЙЛИ
  "prod-milkshakes-001": "https://images.unsplash.com/photo-1572490122747-3e9197aa8a8e?w=400&q=70", // классический
  "prod-milkshakes-002": "https://images.unsplash.com/photo-1585325701956-60dd9c8399b6?w=400&q=70", // ягодный
  "prod-milkshakes-003": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=70", // вилли вонка
  "prod-milkshakes-004": "https://images.unsplash.com/photo-1554580762-8b7f8fa95a60?w=400&q=70", // сникерс

  // СОФТ ДРИНКИ
  "prod-soft-001": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=70", // кола фанта спрайт
  "prod-soft-002": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=70", // соки yan 250
  "prod-soft-003": "https://images.unsplash.com/photo-1576009930228-0f31ffeb7b0f?w=400&q=70", // соки yan 1л
  "prod-soft-004": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=70", // schweppes
  "prod-soft-005": "https://images.unsplash.com/photo-1605405748313-a416a1b84491?w=400&q=70", // san pelegrinno tonic
  "prod-soft-006": "https://images.unsplash.com/photo-1560508179-b2c9a3f8e92b?w=400&q=70", // borjomi
  "prod-soft-007": "https://images.unsplash.com/photo-1523371054106-bbf80586c54b?w=400&q=70", // acqua panna
  "prod-soft-008": "https://images.unsplash.com/photo-1637018219847-1fd2f94c9e65?w=400&q=70", // san pelegrinno
  "prod-soft-009": "https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=400&q=70", // legend
  "prod-soft-010": "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&q=70", // red bull

  // ТАБАК
  "prod-tobacco-001": "https://images.unsplash.com/photo-1558171813-04f14fde4c1a?w=400&q=70",
  "prod-tobacco-002": "https://images.unsplash.com/photo-1506368083636-6defb67639a7?w=400&q=70",
  "prod-tobacco-003": "https://images.unsplash.com/photo-1558171813-04f14fde4c1a?w=400&q=70",
  "prod-tobacco-004": "https://images.unsplash.com/photo-1506368083636-6defb67639a7?w=400&q=70",
  "prod-tobacco-005": "https://images.unsplash.com/photo-1558171813-04f14fde4c1a?w=400&q=70",
  "prod-tobacco-006": "https://images.unsplash.com/photo-1506368083636-6defb67639a7?w=400&q=70",
  "prod-tobacco-007": "https://images.unsplash.com/photo-1558171813-04f14fde4c1a?w=400&q=70",
  "prod-tobacco-008": "https://images.unsplash.com/photo-1506368083636-6defb67639a7?w=400&q=70",
  "prod-tobacco-009": "https://images.unsplash.com/photo-1558171813-04f14fde4c1a?w=400&q=70",
  "prod-tobacco-010": "https://images.unsplash.com/photo-1506368083636-6defb67639a7?w=400&q=70",
  "prod-tobacco-011": "https://images.unsplash.com/photo-1558171813-04f14fde4c1a?w=400&q=70",

  // СИГАРНЫЙ ТАБАК
  "prod-cigar-001": "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=400&q=70",
  "prod-cigar-002": "https://images.unsplash.com/photo-1589395937921-fddc324ccdd2?w=400&q=70",
  "prod-cigar-003": "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=400&q=70",

  // КАБИНКИ
  "prod-cabins-001": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&q=70"
};

// ── State ────────────────────────────────────────────
var cart = JSON.parse(localStorage.getItem('monamiCart') || '[]');
var activeCategory = 'all';
var searchQuery = '';
var menuLoaded = false;

// ── Loader ───────────────────────────────────────────
window.addEventListener('load', function () {
  setTimeout(function () {
    var loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
  }, 1200);
  initMenu();
  updateCartBadge();
});

// ── AOS init ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  if (typeof AOS !== 'undefined') AOS.init({ once: true, duration: 700 });
  // Hamburger
  var ham = document.getElementById('hamburger');
  var mob = document.getElementById('mobileMenu');
  if (ham && mob) {
    ham.addEventListener('click', function () {
      mob.classList.toggle('open');
      ham.classList.toggle('open');
    });
    mob.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mob.classList.remove('open');
        ham.classList.remove('open');
      });
    });
  }
  // Navbar scroll
  window.addEventListener('scroll', function () {
    var nb = document.getElementById('navbar');
    if (nb) nb.classList.toggle('scrolled', window.scrollY > 50);
  });
});

// ── Menu init ────────────────────────────────────────
function initMenu() {
  if (!window.MENU_DATA) return;

  var cats = MENU_DATA.categories;
  var tabsEl = document.getElementById('categoryTabs');
  if (!tabsEl) return;

  // Build tabs: "Все" + each category
  var html = '<button class="cat-tab active" data-cat="all" onclick="filterByCategory(\'all\')">Все</button>';
  cats.forEach(function (cat) {
    html += '<button class="cat-tab" data-cat="' + cat.id + '" onclick="filterByCategory(\'' + cat.id + '\')">' + cat.name + '</button>';
  });
  tabsEl.innerHTML = html;

  // Load first category by default (Завтраки)
  renderCategory('all');
}

// ── Render products for a category ───────────────────
function renderCategory(catId) {
  var grid = document.getElementById('productsGrid');
  if (!grid) return;

  var products = MENU_DATA.products;
  var filtered = catId === 'all'
    ? products
    : products.filter(function (p) { return p.category === catId; });

  // Apply search if active
  if (searchQuery) {
    var q = searchQuery.toLowerCase();
    filtered = filtered.filter(function (p) {
      return p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(function (t) { return t.toLowerCase().includes(q); }));
    });
  }

  if (!filtered.length) {
    grid.innerHTML = '<div class="no-results">Ничего не найдено 😔</div>';
    return;
  }

  grid.innerHTML = filtered.map(function (p) {
    return buildCard(p);
  }).join('');
}

// ── Build product card ────────────────────────────────
function buildCard(p) {
  var img = PRODUCT_PHOTOS[p.id] || 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=70';
  var inCart = cart.filter(function (i) { return i.id === p.id; }).reduce(function (s, i) { return s + i.qty; }, 0);
  var badge = inCart > 0 ? '<span class="card-qty-badge">' + inCart + '</span>' : '';
  var weight = p.weight ? '<span class="card-weight">' + p.weight + '</span>' : '';

  return '<div class="product-card" data-id="' + p.id + '">' +
    '<div class="card-img-wrap">' +
    '<img class="card-img" src="' + img + '" alt="' + p.name + '" loading="lazy" onerror="this.src=\'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=70\'">' +
    badge +
    '</div>' +
    '<div class="card-body">' +
    '<h3 class="card-name">' + p.name + '</h3>' +
    weight +
    (p.description ? '<p class="card-desc">' + p.description + '</p>' : '') +
    '<div class="card-footer">' +
    '<span class="card-price">' + p.price + ' сом</span>' +
    '<button class="btn-add" onclick="addToCart(\'' + p.id + '\', \'' + escapeQuotes(p.name) + '\', ' + p.price + ')">+</button>' +
    '</div>' +
    '</div>' +
    '</div>';
}

function escapeQuotes(str) {
  return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// ── Filter by category (tab click) ───────────────────
function filterByCategory(catId) {
  activeCategory = catId;
  searchQuery = '';
  var searchInput = document.getElementById('menuSearch');
  if (searchInput) searchInput.value = '';

  // Update tab active state
  document.querySelectorAll('.cat-tab').forEach(function (btn) {
    btn.classList.toggle('active', btn.dataset.cat === catId);
  });

  renderCategory(catId);

  // Scroll to menu section smoothly
  var sec = document.getElementById('menu-section');
  if (sec) {
    var top = sec.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }
}

// ── Search ────────────────────────────────────────────
function filterMenu() {
  var input = document.getElementById('menuSearch');
  searchQuery = input ? input.value.trim() : '';

  if (searchQuery) {
    // Search across ALL products regardless of active tab
    activeCategory = 'all';
    document.querySelectorAll('.cat-tab').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.cat === 'all');
    });
  }

  renderCategory(searchQuery ? 'all' : activeCategory);
}

// ── Cart ──────────────────────────────────────────────
function addToCart(id, name, price) {
  var existing = cart.find(function (i) { return i.id === id; });
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: id, name: name, price: price, qty: 1 });
  }
  saveCart();
  updateCartBadge();
  // Update card badge inline
  var card = document.querySelector('.product-card[data-id="' + id + '"]');
  if (card) {
    var wrap = card.querySelector('.card-img-wrap');
    var badge = wrap ? wrap.querySelector('.card-qty-badge') : null;
    var total = cart.find(function (i) { return i.id === id; });
    if (badge) {
      badge.textContent = total ? total.qty : '';
    } else if (wrap && total) {
      var b = document.createElement('span');
      b.className = 'card-qty-badge';
      b.textContent = total.qty;
      wrap.appendChild(b);
    }
  }
  showCartToast(name);
}

function showCartToast(name) {
  var t = document.createElement('div');
  t.className = 'cart-toast';
  t.textContent = '✓ ' + name.substring(0, 30) + ' добавлен(а)';
  document.body.appendChild(t);
  setTimeout(function () { t.classList.add('show'); }, 10);
  setTimeout(function () {
    t.classList.remove('show');
    setTimeout(function () { t.remove(); }, 300);
  }, 2000);
}

function removeFromCart(id) {
  cart = cart.filter(function (i) { return i.id !== id; });
  saveCart();
  updateCartBadge();
  renderCartItems();
}

function changeQty(id, delta) {
  var item = cart.find(function (i) { return i.id === id; });
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(function (i) { return i.id !== id; });
  }
  saveCart();
  updateCartBadge();
  renderCartItems();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartBadge();
  renderCartItems();
}

function saveCart() {
  localStorage.setItem('monamiCart', JSON.stringify(cart));
}

function updateCartBadge() {
  var total = cart.reduce(function (s, i) { return s + i.qty; }, 0);
  var badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = total;
}

function toggleCart() {
  var sidebar = document.getElementById('cartSidebar');
  var overlay = document.getElementById('cartOverlay');
  if (!sidebar) return;
  var isOpen = sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open', isOpen);
  if (isOpen) renderCartItems();
}

function renderCartItems() {
  var container = document.getElementById('cartItems');
  var footer = document.getElementById('cartFooter');
  if (!container) return;

  if (!cart.length) {
    container.innerHTML = '<div class="cart-empty">Корзина пуста</div>';
    if (footer) footer.style.display = 'none';
    return;
  }

  var total = cart.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
  container.innerHTML = cart.map(function (item) {
    return '<div class="cart-item">' +
      '<div class="cart-item-name">' + item.name + '</div>' +
      '<div class="cart-item-controls">' +
      '<button onclick="changeQty(\'' + item.id + '\', -1)">−</button>' +
      '<span>' + item.qty + '</span>' +
      '<button onclick="changeQty(\'' + item.id + '\', 1)">+</button>' +
      '</div>' +
      '<div class="cart-item-price">' + (item.price * item.qty) + ' сом</div>' +
      '<button class="cart-item-remove" onclick="removeFromCart(\'' + item.id + '\')">✕</button>' +
      '</div>';
  }).join('');

  if (footer) {
    footer.style.display = 'block';
    var totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = total + ' сом';
  }
}

// ── Checkout ──────────────────────────────────────────
function openCheckout() {
  if (!cart.length) return;
  toggleCart();
  var modal = document.getElementById('checkoutModal');
  if (modal) modal.classList.add('open');
}

function closeCheckout() {
  var modal = document.getElementById('checkoutModal');
  if (modal) modal.classList.remove('open');
}

function submitOrder() {
  var name = document.getElementById('checkoutName');
  var phone = document.getElementById('checkoutPhone');
  var address = document.getElementById('checkoutAddress');
  var comment = document.getElementById('checkoutComment');
  var payment = document.querySelector('input[name="payment"]:checked');

  if (!name || !name.value.trim()) { name && name.focus(); return; }
  if (!phone || !phone.value.trim()) { phone && phone.focus(); return; }
  if (!address || !address.value.trim()) { address && address.focus(); return; }

  var total = cart.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
  var items = cart.map(function (i) { return i.qty + 'x ' + i.name + ' (' + i.price * i.qty + ' сом)'; }).join('\n');

  var msg = '🛒 *Новый заказ — Mon Ami*\n\n' +
    '👤 Имя: ' + name.value + '\n' +
    '📞 Телефон: ' + phone.value + '\n' +
    '📍 Адрес: ' + address.value + '\n' +
    (comment && comment.value ? '💬 Комментарий: ' + comment.value + '\n' : '') +
    '💳 Оплата: ' + (payment ? payment.value : '') + '\n\n' +
    '📦 Состав заказа:\n' + items + '\n\n' +
    '💰 Итого: ' + total + ' сом';

  var url = 'https://wa.me/996999999999?text=' + encodeURIComponent(msg);
  window.open(url, '_blank');

  clearCart();
  closeCheckout();

  var success = document.createElement('div');
  success.className = 'order-success';
  success.innerHTML = '✅ Заказ отправлен! Мы свяжемся с вами.';
  document.body.appendChild(success);
  setTimeout(function () { success.remove(); }, 4000);
}
