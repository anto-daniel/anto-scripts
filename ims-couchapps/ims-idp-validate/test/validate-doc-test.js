var http = require('http');
var jf = require('jsonfile');
var file = './test/config.json';
var config = jf.readFileSync(file);
var assert = require('assert')
util = require('util'), couchdb = require('felix-couchdb'), client = couchdb
.createClient(config.port,config.host,config.user,config.password), dbtest = client.db(config.db);
//Service Asset
suite('name :', function () {
  test('name field is required', function (done) {
    dbtest.saveDoc({
      _id: 'asset.service:adserve'
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"name field is required\"}");
      done();
    });
  });
});
suite('environments :', function () {
  test('environments field is required', function (done) {
    dbtest.saveDoc({
      _id: 'asset.service:adserve',
      name: 'ad'
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"environments field is required\"}");
      done();
    });
  });
});
suite('name :', function () {
  test('name should be same as id', function (done) {
    dbtest.saveDoc({
      _id: 'asset.service:adserve',
      name: 'ad',
      environments: 'adserve_prod1'
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"name should be same as the unique part of id\"}");
      done();
    });
  });
});
suite('environments :', function () {
  test('environments field should be an array', function (done) {
    dbtest.saveDoc({
      _id: 'asset.service:adserve',
      name: 'adserve',
      environments: 'adserve_prod1'
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"environments should be an array\"}");
      done();
    });
  });
});
suite('environments :', function () {
  test('environments array can contain only [a-z] and underscore', function (done) {
    dbtest.saveDoc({
      _id: 'asset.service:adserve',
      name: 'adserve',
      environments: ['adserve_PROD1']
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"environments  array can contain only [a-z] and underscore\"}");
      done();
    });
  });
});
suite('No Access Control :', function () {
  test('service asset with no access', function (done) {
    dbtest.saveDoc({
      _id: 'asset.service:adserve',
      name: 'adserve',
      environments: ['adserve_prod']
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"access denied\"}");
      done();
    });
  });
});
suite('Invalid Access Control :', function () {
  test('service asset with invalid access', function (done) {
    dbtest.saveDoc({
      _id: 'asset.service:adserve',
      name: 'adserve',
      environments: ['adserve_prod'],
      access: ["sai"],
      allow_access: "*"
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"invalid access specification\"}");
      done();
    });
  });
});
suite('Invalid Access Control :', function () {
  test('service asset with invalid access', function (done) {
    dbtest.saveDoc({
      _id: 'asset.service:adserve',
      name: 'adserve',
      environments: ['adserve_prod'],
      access: null
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"access denied\"}");
      done();
    });
  });
});
suite('Invalid Access Control :', function () {
  test('service asset with invalid access', function (done) {
    dbtest.saveDoc({
      _id: 'asset.service:adserve',
      name: 'adserve',
      environments: ['adserve_prod'],
      allow_access: null
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"access denied\"}");
      done();
    });
  });
});
suite('valid Service Asset :', function () {
  test('service asset with valid access', function (done) {
    dbtest.saveDoc({
      _id: 'asset.service:adserve',
      name: 'adserve',
      environments: ['adserve_prod'],
      allow_access: "*"
    }, function (err, ok) {
      assert.equal(ok.ok, true);
      done();
    });
  });
});



//Environment Asset
suite('name :', function () {
  test('name field is required', function (done) {
    dbtest.saveDoc({
      _id: 'asset.environment:adserve_prod'
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"name field is required\"}");
      done();
    });
  });
});
suite('clusters :', function () {
  test('clusters field is Required', function (done) {
    dbtest.saveDoc({
      _id: 'asset.environment:adserve_prod',
      name: 'pro'
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"clusters field is required\"}");
      done();
    });
  });
});
suite('name :', function () {
  test('name should be same as id', function (done) {
    dbtest.saveDoc({
      _id: 'asset.environment:adserve_prod',
      name: 'pro',
      clusters: 'cluster1'
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"name should be same as the unique part of id\"}");
      done();
    });
  });
});
suite('clusters :', function () {
  test('clusters should be an array', function (done) {
    dbtest.saveDoc({
      _id: 'asset.environment:adserve_prod',
      name: 'adserve_prod',
      clusters: 'adserve_prod_ua2'
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"clusters should be an array\"}");
      done();
    });
  });
});
suite('clusters:', function () {
  test('clusters array can contain only [a-z], [0-9] & underscore', function (done) {
    dbtest.saveDoc({
      _id: 'asset.environment:adserve_prod',
      name: 'adserve_prod',
      clusters: ['AZ']
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"clusters  array can contain only [a-z], [0-9] & underscore\"}");
      done();
    });
  });
});
suite('No Access Control :', function () {
  test('environment asset without access', function (done) {
    dbtest.saveDoc({
      _id: 'asset.environment:adserve_prod',
      name: 'adserve_prod',
      clusters: ['adserve_prod_ua2', 'adserve_prod_ev1']
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"access denied\"}");
      done();
    });
  });
});

suite('Valid Environment Asset :', function () {
  test('environment asset with valid access', function (done) {
    dbtest.saveDoc({
      _id: 'asset.environment:adserve_prod',
      name: 'adserve_prod',
      clusters: ['adserve_prod_ua2', 'adserve_prod_ev1'],
      access: ['imsamdin']
    }, function (err, ok) {
      assert.equal(ok.ok, true);
      done();
    });
  });
});

//Cluster Asset
suite('name :', function () {
  test('name field is Required', function (done) {
    dbtest.saveDoc({
      _id: 'asset.cluster:adserve_prod_ua2'
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"name field is required\"}");
      done();
    });
  });
});
suite('cluster_type :', function () {
  test('cluster_type field is required', function (done) {
    dbtest.saveDoc({
      _id: 'asset.cluster:adserve_prod_ua2',
      name: 'cl1'
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"cluster_type field is required\"}");
      done();
    });
  });
});
suite('vip :', function () {
  test('vip field is required', function (done) {
    dbtest.saveDoc({
      _id: 'asset.cluster:adserve_prod_ua2',
      name: 'cl1',
      cluster_type: 'AZ'
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"vip field is required\"}");
      done();
    });
  });
});
suite('colo :', function () {
  test('colo field is Required', function (done) {
    dbtest.saveDoc({
      _id: 'asset.cluster:adserve_prod_ua2',
      name: 'cl1',
      cluster_type: 'AZ',
      vip: 'test_vip'
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"colo field is required\"}");
      done();
    });
  });
});
suite('lb :', function () {
  test('lb field is Required', function (done) {
    dbtest.saveDoc({
      _id: 'asset.cluster:adserve_prod_ua2',
      name: 'cl1',
      cluster_type: 'AZ',
      vip: 'test_vip',
      colo: 'ZX'
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"lb field is required\"}");
      done();
    });
  });
});
suite('hosts :', function () {
  test('hosts field is Required', function (done) {
    dbtest.saveDoc({
      _id: 'asset.cluster:adserve_prod_ua2',
      name: 'cl1',
      cluster_type: 'AZ',
      vip: 'test_vip',
      colo: 'ZX',
      lb: 'dummy_lb'
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"hosts field is required\"}");
      done();
    });
  });
});
suite('name :', function () {
  test('name field should be same as id', function (done) {
    dbtest.saveDoc({
      _id: 'asset.cluster:adserve_prod_ua2',
      name: 'cl1',
      cluster_type: 'AZ',
      vip: 'test_vip',
      colo: 'ZX',
      lb: 'dummy_lb',
      hosts: 'host1'
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"name should be same as the unique part of id\"}");
      done();
    });
  });
});
suite('cluster_type :', function () {
  test('clustre_type field can contain only [a-z] and underscore', function (done) {
    dbtest.saveDoc({
      _id: 'asset.cluster:adserve_prod_ua2',
      name: 'adserve_prod_ua2',
      cluster_type: 'AZ',
      vip: 'test_vip',
      colo: 'ZX',
      lb: 'dummy_lb',
      hosts: 'host1'
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"cluster_type  field can contain only [a-z] and underscore\"}");
      done();
    });
  });
});
suite('vip :', function () {
  test('valid vip check', function (done) {
    dbtest.saveDoc({
      _id: 'asset.cluster:adserve_prod_ua2',
      name: 'adserve_prod_ua2',
      cluster_type: 'self',
      vip: 'test_vip',
      colo: 'ZX',
      lb: 'dummy_lb',
      hosts: 'host1'
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"enter a valid vip\"}");
      done();
    });
  });
});
suite('colo :', function () {
  test('colo can contain only [a-z], [0-9] & underscore', function (done) {
    dbtest.saveDoc({
      _id: 'asset.cluster:adserve_prod_ua2',
      name: 'adserve_prod_ua2',
      cluster_type: 'self',
      vip: '123.12.11.10',
      colo: 'ZX',
      lb: 'dummy_lb',
      hosts: 'host1'
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"colo  field can contain only [a-z], [0-9] & underscore\"}");
      done();
    });
  });
});
suite('lb :', function () {
  test('valid lb check', function (done) {
    dbtest.saveDoc({
      _id: 'asset.cluster:adserve_prod_ua2',
      name: 'adserve_prod_ua2',
      cluster_type: 'self',
      vip: '123.12.11.10',
      colo: 'ua2',
      lb: 'dummy_lb',
      hosts: 'host1'
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"enter a valid lb\"}");
      done();
    });
  });
});
suite('hosts :', function () {
  test('hosts field sould be an array', function (done) {
    dbtest.saveDoc({
      _id: 'asset.cluster:adserve_prod_ua2',
      name: 'adserve_prod_ua2',
      cluster_type: 'self',
      vip: '123.12.11.10',
      colo: 'ua2',
      lb: 'ads-1001.inmobi.com',
      hosts: 'host1'
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"hosts should be an array\"}");
      done();
    });
  });
});
suite('cluster asset :', function () {
  test('valid cluster asset', function (done) {
    dbtest.saveDoc({
      _id: 'asset.cluster:adserve_prod_ua2',
      name: 'adserve_prod_ua2',
      cluster_type: 'self',
      vip: '123.12.11.10',
      colo: 'ua2',
      lb: 'ads-1001.inmobi.com',
      hosts: ['proc1001.m10n.ua2', 'proc1002.m10n.ua2', 'proc1003.m10n.ua2']
    }, function (err, ok) {
      var data = JSON.stringify(err);
      assert.equal(data, "{\"error\":\"forbidden\",\"reason\":\"access denied\"}");
      done();
    });
  });
});
suite('valid cluster asset', function () {
  test('cluster asset with valid access', function (done) {
    dbtest.saveDoc({
      _id: 'asset.cluster:adserve_prod_ua2',
      name: 'adserve_prod_ua2',
      cluster_type: 'self',
      vip: '123.12.11.10',
      colo: 'ua2',
      lb: 'ads-1001.inmobi.com',
      hosts: ['proc1001.m10n.ua2', 'proc1002.m10n.ua2', 'proc1003.m10n.ua2'],
      access: ["imsadmin"]
    }, function (err, ok) {
      assert.equal(ok.ok, true);
      done();
    });
  });
});
