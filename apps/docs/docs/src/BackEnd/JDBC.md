# JDBC

## 概述

JDBC(Java database connectivity)，意为Java数据库连接，是Java提供的一组独立于任何数据库管理系统的API。Java提供接口规范，由各个数据库厂商提供接口的实现，厂商提供的实现类封装成jar文件，即数据库驱动jar包。

<br />

## 安装配置

1. 准备数据库
2. MySQL驱动下载：[官网](https://downloads.mysql.com/archives/c-j/)
3. 创建Java项目，项目下创建lib文件夹，将下载的驱动jar包复制到里面
4. 右键选择 `add as library`，与项目集成
5. 编写代码

<br />

## 核心API

### 注册驱动

当使用JDBC连接数据库时，需要加载数据库特定的驱动程序，以便与数据库通信。从JDK6开始，不再需要显示调用下面的代码来加载驱动程序，只要在类路径中集成了对应的jar文件，会自动在初始化时注册驱动程序。

```java
Class.forName("com.mysql.cj.jdbc.Driver");
```

<br />

### Connection

该接口用于实现建立与数据库的通信信道，实例化的对象不为空，就代表一次数据库连接。在建立连接时，需要指定数据库URL `jdbc:mysql://IP:port/数据库名称?key=value&key=value`、用户名、密码参数。

可以创建 statement对象，用于执行SQL语句并与数据库进行交互。在使用JDBC时，必须要先获取Connection对象，使用完毕后要释放资源，避免资源占用浪费及泄露。

<br />

### Statement

该接口用于实现执行SQL语句并与数据库进行交互，可以向数据库发送SQL语句并获取执行结果，动态SQL有注入的风险。

<br />

### PreparedStatement

是Statement接口的子接口，用于执行预编译的SQL查询，提前固定SQL语句，支持参数化查询，防止SQL注入

```java
PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM employee where id = ?");
preparedStatement.setInt(1, 1);
ResultSet resultSet = preparedStatement.executeQuery();
```

<br />

### ResultSet

该接口用于实现从数据库中执行查询语句所返回的结果集，提供了一种用于遍历和访问查询结果的方式。可以使用next()方法判断是否有下一行，逐行遍历数据库查询的结果，也可以通过getxxx的方法获取单列的数据，支持索引和列名进行获取。

<br />

## 实体类&ORM

- 一个表对应一个类，一行数据对应Java中的一个对象，一个列对应的是对象的属性，要把数据存储在一个载体里，这个载体就是实体类
- ORM(Object Relational Mapping)思想，对象到关系数据库的映射，作用是在编程中，把面向对象的概念和数据库中的表的的概念对应起来，即一张表对应一个类，一行数据对应一个对象，一个列对应一个属性

<br />

## 主键回显

```java
// 更新时需要返回新增后的主键列
Employee employee = new Employee();
PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM employee where id = ?", Statement.RETURN_GENERATED_KEYS);

int result = prepatedStatement.executeUpdate();
if (result > 0) {
  // 返回的主键值是一个单行单列的结果
  ResultSet resultSet = prepatedStatement.getGeneratedKeys();
  if (resultSet.next()) {
    int empId = resultSet.getInt(1);
    employee.setEmpId(empId);
    System.out.printIn(employee);
  }
}
```

<br />

## 批量操作

插入多条数据时，一条一条发送给数据库执行，效率低下，通过批量操作，可以提升多次操作效率。

1. 在连接数据库的URL后面追加 `?rewriteBatchedStatements=true`，允许批量操作
2. 新增SQL必须使用 VALUES ，语句最后不要追加 `;` 结束
3. 调用 `addBatch()` 方法，将SQL语句进行批量添加操作
4. 统一执行批量操作，调用 `executeBatch()`

```java
Connection connection = DriverManager.getConnection("jdbc:mysql://xxx:xxx/xxx?rewriteBatchedStatements=true", "root", "123456");
String sql = "INSERT INTO employee (name, salary, age) VALUES(?, ?, ?)"; // SQL语句不能加;
PreparedStatement preparedStatement = connection.prepareStatement(sql);
for (int i = 0; i < 10000; i++) {
  preparedStatement.setString(1, "name" + i);
  preparedStatement.setDouble(2, 100.0 + i);
  preparedStatement.setInt(3, 10 + i);
  preparedStatement.addBatch(); // 添加批处理
}
preparedStatement.executeBatch(); // 执行批处理
```

<br />

## 连接池

每次操作数据库都要获取新连接，使用完毕就close释放，频繁的创建和销毁造成资源浪费；且连接的数量无法把控，对服务器来说压力巨大。

连接池就是数据库连接对象的缓冲区，通过配置，由连接池负责创建连接，使用完毕后，将连接放回池中，避免频繁的创建和销毁。当池中无连接可用且未达到上限时，连接池会重新连接；池中连接达到上限，用户请求会等待，可以设置超时时间。

JDBC的数据库连接池使用 `javax.sql.DataSource` 接口进行规范，所有的第三方连接池都实现此接口，所有连接池获取连接和回收连接的方法都一样，不同的只有性能和扩展功能。

### Druid

> jar包：`druid.jar`

硬编码：将连接池的配置信息和java代码耦合在一起

1. 创建 `DruidDataSource` 连接池对象
2. 设置连接池的配置信息(有的信息必须，有的非必须)
3. 通过连接池获取连接对象
4. 开发CURD
5. 回收连接到连接池

```java
public void testHardCodeDruid() throws Exception {
  try (DruidDataSource druidDataSource = new DruidDataSource()) {
    // 必须配置
    druidDataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
    druidDataSource.setUrl("jdbc:mysql://192.168.31.2:3307/test");
    druidDataSource.setUsername("root");
    druidDataSource.setPassword("123456");

    // 非必须配置
    druidDataSource.setInitialSize(10); // 初始化连接数10
    druidDataSource.setMaxActive(30); // 最大连接数30

    // 获取连接
    Connection connection = druidDataSource.getConnection();

    // 使用连接
    System.out.println(connection);

    // 关闭连接
    connection.close();
  }

}
```

软编码(推荐)：在项目目录下创建 resources文件夹，标识该文件夹为资源目录，创建 `db.properties` 配置文件，将连接池信息定义在该文件中

1. 创建 Properties 集合，用于存储外部配置文件的key和value
2. 读取外部配置文件，获取输入流，加载到 Properties 集合中
3. 基于Properties集合构建 DruidDataSource连接池
4. 通过连接池获取连接对象
5. 开发CURD
6. 回收连接

```properties
# druid连接池需要的配置参数，key固定命名
driverClassName=com.mysql.cj.jdbc.Driver
url=jdbc:mysql://192.168.x.x:x/test
username=root
password=xxx
initialSize=10
maxActive=20
```

```java
 public void testResourcesDruid() throws Exception {
   Properties properties = new Properties();
   InputStream inputStream = DruidTest.class.getClassLoader().getResourceAsStream("db.properties");
   properties.load(inputStream);
   DataSource dataSource = DruidDataSourceFactory.createDataSource(properties);
   Connection connection = dataSource.getConnection();
   System.out.println(connection);
   connection.close();
 }
```

<br />

### Hikari

> jar包：`HikariCP.jar`、`slf4j-api.jar`

硬编码：

```java
public void testHardCodeHikari() throws Exception {
    HikariDataSource hikariDataSource = new HikariDataSource();
    // 必须配置
    hikariDataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
    hikariDataSource.setJdbcUrl("jdbc:mysql://192.168.31.2:3307/test");
    hikariDataSource.setUsername("root");
    hikariDataSource.setPassword("123456");

    // 非必须配置
    hikariDataSource.setMinimumIdle(10); // 初始化连接数10
    hikariDataSource.setMaximumPoolSize(30); // 最大连接数30

    // 获取连接
    Connection connection = hikariDataSource.getConnection();

    // 使用连接
    System.out.println(connection);

    // 关闭连接
    connection.close();
  }
```

软编码：

```properties
# hikari连接池需要的配置参数
driverClassName=com.mysql.cj.jdbc.Driver
jdbcUrl=jdbc:mysql://192.168.x.x:x/test
username=root
password=xxx
minimumIdle=10
maximumPoolSize=20
```

```java
public void testResourcesHikari() throws Exception {
  Properties properties = new Properties();
  InputStream inputStream = HikariTest.class.getClassLoader().getResourceAsStream("db.properties");
  properties.load(inputStream);
  HikariConfig hikariConfig = new HikariConfig(properties);
  HikariDataSource hikariDataSource = new HikariDataSource(hikariConfig);
  Connection connection = hikariDataSource.getConnection();
  System.out.println(connection);
  connection.close();
}
```

<br />

## JDBC工具类

1. 维护一个连接池对象
2. 对外提供在连接池中获取连接的方法
3. 对外提供回收连接的方法

```java
package com.sze.base.util;

import com.alibaba.druid.pool.DruidDataSourceFactory;

import javax.sql.DataSource;
import java.io.InputStream;
import java.sql.Connection;
import java.util.Properties;

public class JDBCUtil {
  /**
   * 数据源
   */
  private static DataSource dataSource;

  // 静态代码块，获取连接池对象
  static {
    try {
      Properties properties = new Properties();
      InputStream inputStream = JDBCUtil.class.getClassLoader().getResourceAsStream("db.properties");
      properties.load(inputStream);
      dataSource = DruidDataSourceFactory.createDataSource(properties);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  /**
   * 获取连接
   * @return
   */
  public static Connection getConnection() {
    try {
      return dataSource.getConnection();
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  /**
   * 关闭连接
   * @param connection
   */
  public static void close(Connection connection) {
    try {
      if (connection != null) {
        connection.close();
      }
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }
}
```

```java
// 使用

import org.junit.Test;

import java.sql.Connection;

public class UtilTest {
  @Test
  public void test() {
    Connection connection = JDBCUtil.getConnection();
    System.out.println(connection);

    JDBCUtil.close(connection);
  }
}
```

<br />

## ThreadLocal

JDK1.2中提供的 `java.lang.ThreadLocal`，用于保存某个线程共享变量，每个线程对象都有 `ThreadLocalMap<ThreadLocal, Object>`，对于同一个 `static ThreadLocal`，不同线程只能从中get、set、remove自己的变量，不会影响其他线程的变量。

```java
package com.sze.base.util;

import com.alibaba.druid.pool.DruidDataSourceFactory;

import javax.sql.DataSource;
import java.io.InputStream;
import java.sql.Connection;
import java.util.Properties;

public class JDBCUtil2 {
  /**
   * 数据源
   */
  private static DataSource dataSource;
  /**
   * 连接对象
   */
  private static final ThreadLocal<Connection> THREAD_LOCAL = new ThreadLocal<>();

  // 静态代码块，获取连接池对象
  static {
    try {
      Properties properties = new Properties();
      InputStream inputStream = JDBCUtil.class.getClassLoader().getResourceAsStream("db.properties");
      properties.load(inputStream);
      dataSource = DruidDataSourceFactory.createDataSource(properties);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  /**
   * 获取连接
   * @return
   */
  public static Connection getConnection() {
    try {
      Connection connection = THREAD_LOCAL.get();
      if (connection == null) {
        connection = dataSource.getConnection();
        THREAD_LOCAL.set(connection);
      }
      return connection;
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  /**
   * 关闭连接
   */
  public static void close() {
    try {
      Connection connection = THREAD_LOCAL.get();
      if (connection != null) {
        connection.close();
        THREAD_LOCAL.remove();
      }
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }
}
```

<br />

## DAO封装

DAO(Data Access Object)：数据访问对象，该层只关注对数据库的操作，供业务层Service调用。

基本上每一个数据表都应该有一个对应的DAO接口及其实现类，对所有表的CURD操作代码重复度很高，可以抽取公共代码，给DAO的实现类抽取一个公共的父类，称为BaseDAO。

```java
// EmployeeDao.java
// 定义接口规范

package com.sze.base.dao;

import com.sze.base.pojo.Employee;
import java.util.List;

public interface EmployeeDao {
  /**
   * 查询所有员工
   * @return 员工列表
   */
  List<Employee> selectAll();

  /**
   * 根据id查询员工
   * @param id 员工id
   * @return 员工对象
   */
  Employee selectById(Integer id);

  /**
   * 添加员工
   * @param employee 员工对象
   * @return 受影响的行数
   */
  int insert(Employee employee);

  /**
   * 更新员工
   * @param employee 员工对象
   * @return 受影响的行数
   */
  int update(Employee employee);

  /**
   * 根据id删除员工
   * @param id 员工id
   * @return 受影响的行数
   */
  int delete(Integer id);
}
```

```java
// BaseDao.java

package com.sze.base.dao;

import com.sze.base.util.JDBCUtil2;

import java.lang.reflect.Field;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 基础DAO，用于封装通用的数据库操作
 */
public class BaseDAO {

  /**
   * 通用更新操作
   * @param sql SQL语句
   * @param params SQL语句中的占位符要赋值的参数
   * @return 受影响的行数
   */
  public int executeUpdate(String sql, Object... params) throws Exception {
    Connection connection = JDBCUtil2.getConnection();
    PreparedStatement preparedStatement = connection.prepareStatement(sql);

    if (params != null && params.length > 0) {
      for (int i = 0; i < params.length; i++) {
        preparedStatement.setObject(i + 1, params[i]);
      }
    }

    int row = preparedStatement.executeUpdate();
    preparedStatement.close();
    JDBCUtil2.close();
    return row;
  }

  /**
   * 通用查询操作
   * @param sql SQL语句
   * @param params SQL语句中的占位符要赋值的参数
   * @return 查询结果
   */
  public <T> List<T> executeQuery(Class<T> clazz, String sql, Object... params) throws Exception {
    Connection connection = JDBCUtil2.getConnection();
    PreparedStatement preparedStatement = connection.prepareStatement(sql);

    if (params != null && params.length > 0) {
      for (int i = 0; i < params.length; i++) {
        preparedStatement.setObject(i + 1, params[i]);
      }
    }

    ResultSet resultSet = preparedStatement.executeQuery();

    // 获取结果集的元数据
    ResultSetMetaData metaData = resultSet.getMetaData();
    int columnCount = metaData.getColumnCount();
    List<T> list = new ArrayList<>();

    // 获取列数
    while (resultSet.next()) {
      T t = clazz.newInstance();
      // 遍历每一列
      for (int i = 1; i <= columnCount; i++) {
        Object value = resultSet.getObject(i);
        // 获取列名
        String columnName = metaData.getColumnLabel(i);

        // 使用反射赋值
        // 获取属性
        Field field = clazz.getDeclaredField(columnName);
        // 设置属性可访问
        field.setAccessible(true);
        // 给属性赋值
        field.set(t, value);
      }
      list.add(t);
    }
    resultSet.close();
    preparedStatement.close();
    JDBCUtil2.close();
    return list;
  }

  /**
   * 通用查询操作，返回单个对象
   * @param clazz 类型
   * @param sql SQL语句
   * @param params SQL语句中的占位符要赋值的参数
   * @return 查询结果
   * @param <T> 类型
   */
  public <T> T executeQueryOne(Class<T> clazz, String sql, Object... params) throws Exception {
    List<T> list = executeQuery(clazz, sql, params);
    return !list.isEmpty() ? list.get(0) : null;
  }
}
```

```java
// EmployeeDaoImpl.java

package com.sze.base.dao.impl;

import com.sze.base.dao.BaseDAO;
import com.sze.base.dao.EmployeeDao;
import com.sze.base.pojo.Employee;

import java.util.List;

public class EmployeeDaoImpl extends BaseDAO implements EmployeeDao {
  @Override
  public List<Employee> selectAll() {
    try {
      String sql = "SELECT * FROM employee";
      return executeQuery(Employee.class, sql, null);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public Employee selectById(Integer id) {
    try {
      String sql = "SELECT * FROM employee WHERE id = ?";
      return executeQueryOne(Employee.class, sql, id);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public int insert(Employee employee) {
    String sql = "INSERT INTO employee(name, age, salary) VALUES(?, ?, ?)";
    try {
      return executeUpdate(sql, employee.getName(), employee.getAge(), employee.getSalary());
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public int update(Employee employee) {
    String sql = "UPDATE employee SET name = ?, age = ?, salary = ? WHERE id = ?";
    try {
      return executeUpdate(sql, employee.getName(), employee.getAge(), employee.getSalary(), employee.getId());
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public int delete(Integer id) {
    String sql = "DELETE FROM employee WHERE id = ?";
    try {
      return executeUpdate(sql, id);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }
}
```

```java
// test.java

public void testEmployeeDao() {
  EmployeeDao employeeDao = new EmployeeDaoImpl();

  // 查询所有员工
  /*List<Employee> employees = employeeDao.selectAll();
    for (Employee employee : employees) {
      System.out.println("employee:" + employee);
    }*/

  // 根据id查询员工
  /*Employee employee = employeeDao.selectById(1);
    System.out.println("我查的employee是:" + employee);*/

  // 插入员工
  /*Employee employee = new Employee(null, "赵四", 23, 5000.0);
    int insert = employeeDao.insert(employee);
    System.out.println("插入了" + insert + "条数据");*/

  // 更新员工
  /*Employee employee = new Employee(1, "andy_sze", 22, 40000.0);
    int update = employeeDao.update(employee);
    System.out.println("更新了" + update + "条数据");*/

  // 删除员工
  int delete = employeeDao.delete(4);
  System.out.println("删除了" + delete + "条数据");
}
```

<br />

## 事务实现

```java
Connection connection = JDBCUtil2.getConnection();
try {
  // 关闭自动提交事务
  connection.setAutoCommit(false);

  // 执行curd

  // 所有操作执行正确，提交事务
  connection.commit();
} catch (Exception e) {
  throw new Execption(e);
  // 出现异常，则回滚事务
  connection.rollback();
} finally {
  JDBCUtil2.close();
}
```

<br />
